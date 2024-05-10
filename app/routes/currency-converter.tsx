import {
  ActionFunctionArgs,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { styled } from "styled-components";
import { getSession } from "~/session.server";

export const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Inter", sans-serif;
  height: 100vh;
  background: linear-gradient(180deg, #6100ff 0%, #877bbd 100%);
`;

const ConverterContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 350px; // Narrower on mobile;
  background: linear-gradient(180deg, #6100ff 0%, #877bbd 100%);

  @media (min-width: 768px) {
    max-width: 600px; // Wider on desktop
  }
`;

const StyledForm = styled(Form)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  align-items: center;

  @media (min-width: 768px) {
    grid-template-columns: 2fr 3fr 3fr 1fr; // Grid layout for desktop
    align-items: center;
  }
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
`;

const StyledButton = styled.button`
  background-color: #6200ee;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: #5300de;
  }
`;

const ResultText = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 16px;
`;

const ResultBig = styled.div`
  font-size: 32px;
  font-weight: 600; // Semi-bold
  color: #6200ee; // Assuming you want the result in a different color
  margin: 10px 0;
`;

const ResultSmall = styled.div`
  font-size: 20px;
  font-weight: 600; // Semi-bold
`;

const ConversionRate = styled.div`
  font-size: 16px;
  font-weight: 400; // Regular
`;

export const loader: LoaderFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const session = await getSession(request);
  console.log(session, "session");
  if (!session.has("user") || !session.get("user")) {
    return redirect("/sign-in");
  }

  const listUrl = "https://currency-exchange.p.rapidapi.com/listquotes";
  const listOptions = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "cb0a072e3dmshbbc1539f86e2c68p10f7f4jsn1156aa48d457",
      "X-RapidAPI-Host": "currency-exchange.p.rapidapi.com",
    },
  };

  let currencies;
  try {
    const listResponse = await fetch(listUrl, listOptions);
    if (!listResponse.ok) {
      throw new Error("Failed to fetch the currency list");
    }
    currencies = await listResponse.json();
  } catch (error) {
    console.error("Failed to fetch currency list:", error);
    return json({ error: "Failed to fetch currency list" }, { status: 500 });
  }

  const url = new URL(request.url);
  const fromCurrency = url.searchParams.get("from");
  const toCurrency = url.searchParams.get("to");
  const amount = url.searchParams.get("amount");

  if (!fromCurrency || !toCurrency || !amount) {
    return json({ currencies }, { status: 200 });
  }

  const apiURL = `https://currency-exchange.p.rapidapi.com/exchange?from=${fromCurrency}&to=${toCurrency}&q=${amount}`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "cb0a072e3dmshbbc1539f86e2c68p10f7f4jsn1156aa48d457",
      "X-RapidAPI-Host": "currency-exchange.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(apiURL, options);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch conversion data: ${response.statusText}`
      );
    }
    const result = await response.text();
    const conversionResult = parseFloat(result) * parseFloat(amount);
    return json({
      result: {
        fromAmount: amount,
        fromCurrency: fromCurrency,
        toAmount: conversionResult.toFixed(2),
        toCurrency: toCurrency,
        rate: parseFloat(result).toFixed(6),
      },
      currencies,
    });
  } catch (error) {
    return json({ error: error, currencies }, { status: 500 });
  }
};

export default function CurrencyConverter() {
  const { result, currencies, error } = useLoaderData<typeof loader>();

  return (
    <PageContainer>
      <ConverterContainer>
        <StyledForm method="get">
          <StyledInput as="select" name="from" required>
            {currencies.map((currency: string) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </StyledInput>
          <StyledInput as="select" name="to" required>
            {currencies.map((currency: string) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </StyledInput>
          <StyledInput
            type="number"
            name="amount"
            placeholder="Amount"
            required
          />
          <StyledButton type="submit">Convert</StyledButton>
        </StyledForm>
        {result && (
          <>
            <ResultSmall>{`${result.fromAmount} ${result.fromCurrency}`}</ResultSmall>
            <ResultBig>{`${result.toAmount} ${result.toCurrency}`}</ResultBig>
            <ConversionRate>{`1 ${result.toCurrency} = ${result.rate} ${result.fromCurrency}`}</ConversionRate>
          </>
        )}
        {error && <ResultText style={{ color: "red" }}>{error}</ResultText>}
      </ConverterContainer>
    </PageContainer>
  );
}
