import { PageContainer } from "./currency-converter";

export default function Index() {
  return (
    <PageContainer>
      <div style={{ textAlign: "center", maxWidth: "600px" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
          Trusted Global Currency Converter & Money Transfer Solutions
        </h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
          Best source for currency conversion, sending money online and tracking
          exchange rates
        </p>
        <a
          href="/currency-converter"
          style={{
            display: "inline-block",
            backgroundColor: "#FFFFFF",
            color: "#000000",
            padding: "10px 20px",
            borderRadius: "5px",
            textDecoration: "none",
            margin: "0 10px",
            fontWeight: "bold",
          }}
        >
          Convert
        </a>
        <a
          href="/sign-in"
          style={{
            display: "inline-block",
            backgroundColor: "#FFFFFF",
            color: "#000000",
            padding: "10px 20px",
            borderRadius: "5px",
            textDecoration: "none",
            margin: "0 10px",
            fontWeight: "bold",
          }}
        >
          Sign In
        </a>
      </div>
    </PageContainer>
  );
}
