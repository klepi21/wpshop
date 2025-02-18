'use client';

import { createChart, ColorType, UTCTimestamp } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

interface PriceData {
  date: string;
  price: string;
}

interface ChartProps {
  data: PriceData[];
  containerClassName?: string;
}

type TimeFrame = '1D' | '1M' | '6M' | '1Y';

export const PriceChart = ({ data, containerClassName = '' }: ChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1D');

  const filterDataByTimeFrame = (data: PriceData[], timeFrame: TimeFrame): PriceData[] => {
    const now = new Date();
    const cutoff = new Date();

    switch (timeFrame) {
      case '1D':
        cutoff.setDate(now.getDate() - 1);
        break;
      case '1M':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case '6M':
        cutoff.setMonth(now.getMonth() - 6);
        break;
      case '1Y':
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
    }

    return data.filter(item => new Date(item.date) >= cutoff);
  };

  useEffect(() => {
    if (!chartContainerRef.current || !data.length) return;

    // Initialize chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'rgba(255, 255, 255, 0.5)',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      rightPriceScale: {
        borderVisible: false,
        autoScale: true,
        alignLabels: true,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        }
      }
    });

    // Create the line series
    const lineSeries = chart.addLineSeries({
      color: '#22c55e',
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      lineType: 0,
      priceFormat: {
        type: 'price',
        precision: 6,
        minMove: 0.000001,
      },
      lastValueVisible: true,
      priceLineVisible: false,
    });

    // Filter and format the data
    const filteredData = filterDataByTimeFrame(data, timeFrame);
    const formattedData = filteredData.map(item => ({
      time: (new Date(item.date).getTime() / 1000) as UTCTimestamp,
      value: parseFloat(item.price)
    }));

    // Set the data
    lineSeries.setData(formattedData);

    // Fit the content
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
      }
    };

    window.addEventListener('resize', handleResize);
    chartRef.current = chart;

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, timeFrame]);

  const timeframes: { label: string; value: TimeFrame }[] = [
    { label: '1D', value: '1D' },
    { label: '1M', value: '1M' },
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' }
  ];

  return (
    <div className={`w-full ${containerClassName}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Price Chart</h3>
        <div className="flex gap-1 md:gap-2 overflow-x-auto">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeFrame(tf.value)}
              className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm transition-colors ${
                timeFrame === tf.value
                  ? 'bg-primary text-white'
                  : 'text-white/60 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} />
    </div>
  );
}; 