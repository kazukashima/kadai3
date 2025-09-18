// App.test.tsx
import { render, screen, within, waitFor } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

// ✅ 本物ではなく __mocks__/utils/supabase.ts を使うよう指定
jest.mock("../utils/supabase", () => require("../__mocks__/utils/supabase"));



// --- Provider付き render ヘルパー ---
const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

test("ローディングスピナーが表示される", async () => {
  renderWithProviders(<App />);
  expect(screen.getByRole("status")).toBeInTheDocument();

});

test("新規登録ボタンが表示される", async () => {
  renderWithProviders(<App />);
  const button = await screen.findByRole("button", { name: /新規登録/i });
  expect(button).toBeInTheDocument();
});

test("タイトルが表示されている", async () => {
  renderWithProviders(<App />);
  expect(await screen.findByText(/学習記録/i)).toBeInTheDocument(); // 修正
});

test("学習内容と学習時間が未入力だとエラーが出る", async () => {
  renderWithProviders(<App />);
  const openBtn = await screen.findByRole("button", { name: /新規登録/i });
  await userEvent.click(openBtn);
  const dialog = await screen.findByRole("dialog");

  const submitBtn = within(dialog).getByRole("button", { name: /登録/i });
  await userEvent.click(submitBtn);

  expect(
    await within(dialog).findByText(/内容の入力は必須です/i)
  ).toBeInTheDocument();
  expect(
    await within(dialog).findByText(/時間は1以上である必要があります/i) // 修正
  ).toBeInTheDocument();
});


test("学習時間が1未満だとエラーが出る", async () => {
  renderWithProviders(<App />);
  const openBtn = await screen.findByRole("button", { name: /新規登録/i });
  await userEvent.click(openBtn);
  const dialog = await screen.findByRole("dialog");

  const titleInput = within(dialog).getByLabelText(/学習内容/i);
  await userEvent.type(titleInput, "負のテスト");

  const timeInput = within(dialog).getByLabelText(/学習時間/i);
  await userEvent.clear(timeInput);
  await userEvent.type(timeInput, "0"); // ❌ 1未満を入力

  const submitBtn = within(dialog).getByRole("button", { name: /登録/i });
  await userEvent.click(submitBtn);

  await waitFor(() => {
    expect(
      within(dialog).getByText(/時間は1以上である必要があります/i)
    ).toBeInTheDocument();
  });
});
