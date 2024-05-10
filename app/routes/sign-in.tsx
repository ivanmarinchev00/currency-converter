import { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useActionData } from "@remix-run/react";
import { styled } from "styled-components";
import { commitSession, getSession } from "~/session.server";
import { PageContainer } from "./currency-converter";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(#6100ff 0%, #877bbd 100%);
  color: #ffffff;
  font-family: "Inter", sans-serif;
  padding: 0 20px;
  box-sizing: border-box;
`;

export const Content = styled.div`
  text-align: center;
  max-width: 600px;
  width: 100%;
`;

export const Heading = styled.h1`
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 20px;
  @media (max-width: 600px) {
    font-size: 28px;
  }
`;

export const Text = styled.p`
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 30px;
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

export const ErrorMessage = styled.p`
  color: red;
`;

export const StyledInput = styled.input`
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: calc(100% - 22px);
`;

export const StyledButton = styled.button`
  background-color: #ffffff;
  color: #000000;
  padding: 10px 20px;
  border-radius: 20px;
  text-decoration: none;
  margin-top: 20px;
  font-weight: bold;
  cursor: pointer;
`;
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  if (username === "ivan" && password === "ivan") {
    const session = await getSession(request);
    session.set("user", username);
    return redirect("/currency-converter", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    return json(
      { errorMessage: "Invalid username or password" },
      { status: 400 }
    );
  }
};

export default function SignIn() {
  const actionData = useActionData<typeof action>();

  return (
    <PageContainer>
      <Content>
        <Heading>Sign In</Heading>
        <Text>Please sign in to access the currency converter.</Text>
        <Form method="post">
          <StyledInput
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            required
          />
          <StyledInput
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          {actionData?.errorMessage && (
            <ErrorMessage>{actionData.errorMessage}</ErrorMessage>
          )}
          <StyledButton type="submit">Sign In</StyledButton>
        </Form>
      </Content>
    </PageContainer>
  );
}
