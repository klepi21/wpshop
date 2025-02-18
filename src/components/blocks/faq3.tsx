import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface Faq3Props {
  heading?: string;
  description?: string;
  items?: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  supportHeading?: string;
  supportDescription?: string;
  supportButtonText?: string;
  supportButtonUrl?: string;
}

const faqItems = [
  {
    id: "faq-1",
    question: "What payment methods do you accept?",
    answer: "We accept cryptocurrency payments through the MultiversX ecosystem. You can pay with EGLD, USDC, or RARE tokens.",
  },
  {
    id: "faq-2",
    question: "Can I track my order?",
    answer: "Yes, you can track your order status by visiting the 'My Orders' page in your account. Once your order is shipped, the tracking number will be available there.",
  },
  {
    id: "faq-3",
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for unworn items in their original packaging. Please contact our support team to initiate a return.",
  },
  {
    id: "faq-4",
    question: "How long does shipping take?",
    answer: "Standard shipping typically takes 5-7 business days. We also offer express shipping which takes 2-3 business days. Shipping times may vary based on your location.",
  },
  {
    id: "faq-6",
    question: "Do you ship internationally?",
    answer: "Yes, we ship worldwide. International shipping times and costs may vary depending on your location.",
  },
  {
    id: "faq-7",
    question: "Do you offer custom designs?",
    answer:
      "Yes! We specialize in custom wooden designs. Contact us with your ideas, and we'll work together to create something unique. Custom orders may require additional processing time.",
  },
  {
    id: "faq-8",
    question: "How do I care for my wooden items?",
    answer:
      "Keep your items away from direct sunlight and excessive moisture. Clean with a soft, dry cloth. For detailed care instructions, refer to the product-specific guide included with your order.",
  },
];

const Faq3 = ({
  heading = "Frequently Asked Questions",
  description = "Find answers to common questions about our products, shipping, and services. Can't find what you're looking for? Our support team is here to help.",
  items = faqItems,
  supportHeading = "Need Additional Help?",
  supportDescription = "Our team is here to assist you with any questions about our wooden creations or your order. We typically respond within 24 hours.",
  supportButtonText = "Contact Us",
  supportButtonUrl = "mailto:contact@woodenpunks.com",
}: Faq3Props) => {
  return (
    <section className="py-32">
      <div className="container space-y-16">
        <div className="mx-auto flex max-w-3xl flex-col text-left md:text-center">
          <h2 className="mb-3 text-3xl font-semibold md:mb-4 lg:mb-6 lg:text-4xl text-white">
            {heading}
          </h2>
          <p className="text-white/60 lg:text-lg">{description}</p>
        </div>
        <Accordion type="single" collapsible className="mx-auto w-full lg:max-w-3xl">
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border-white/10">
              <AccordionTrigger className="text-white">
                <div className="font-medium sm:py-1 lg:py-2 lg:text-lg">
                  {item.question}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-white/60 lg:text-lg">
                  {item.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mx-auto flex max-w-4xl flex-col items-center rounded-lg bg-white/5 p-4 text-center md:rounded-xl md:p-6 lg:p-8">
          <h3 className="mb-2 max-w-3xl font-semibold lg:text-lg text-white">
            {supportHeading}
          </h3>
          <p className="mb-8 max-w-3xl text-white/60 lg:text-lg">
            {supportDescription}
          </p>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
            <Button asChild className="bg-gradient-to-r from-[#A67C52] to-[#D4B08C] text-black">
              <a href={supportButtonUrl}>{supportButtonText}</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Faq3 }; 