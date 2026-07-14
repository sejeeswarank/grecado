import { CONTACT } from "../data/constants";

export function generateWhatsAppMessage(product) {
  return `Hello Grecado! I am interested in purchasing the following item from your shop:

• *Garment:* ${product.name}
• *Category:* ${product.category}
• *Color:* ${product.color}
• *Price:* ₹${product.price.toLocaleString("en-IN")}
• *Requested Size:* [size]

Please let me know if this is currently available in stock. Thank you!`;
}

export default function WhatsAppButton({ product, className = "" }) {
  const message = product
    ? generateWhatsAppMessage(product)
    : "Hello Grecado! I would like to know more about your products.";

  return (
    <a
      href={`https://wa.me/${CONTACT.whatsappRaw}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      Inquire & Chat on WhatsApp
    </a>
  );
}
