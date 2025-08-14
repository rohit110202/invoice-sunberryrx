import {
  reactExtension,
  useApi,
  Button,
  Link,
} from "@shopify/ui-extensions-react/customer-account";
import { useState, useEffect } from "react";

export default reactExtension(
  "customer-account.order-status.block.render",
  () => <PromotionBanner />
);

function PromotionBanner() {
  const { order, cost, lines } = useApi();
  const [pdfUrl, setPdfUrl] = useState("");
  console.log(order?.current?.id);
  let orderId = order?.current?.id || "Unknown";
  orderId = orderId.replace("gid://shopify/Order/", "");
  const orderData = {
    order_id: orderId,
  };

  useEffect(() => {
    getPdfLink();
  }, []); // Run once when component mounts

  async function getPdfLink() {
    try {
      const response = await fetch(
        "https://dev.shopifyexperthelp.com/app/account-editor/sunberryrx/pdflink.php",
        
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      const result = await response.json();
      if (result.success && result.pdf_link) {
        setPdfUrl(result.pdf_link); // Update state with PDF URL
      } else {
        console.error("Failed to generate PDF:", result.message);
      }
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  }

  return (
    <>

      {pdfUrl && <Link to={pdfUrl} external={true}>
        <Button  >
          Download Invoice
        </Button>
      </Link>}
    </>
  );
}
