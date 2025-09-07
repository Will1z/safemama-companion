import { render } from "@testing-library/react";
import React from "react";
import { Button } from "@/components/ui/button";

function LinkMock({ children }: any) { 
  return <a href="/test">{children}</a>; 
}

describe("Button asChild behavior", () => {
  it("allows exactly one element child with asChild", () => {
    const { getByText } = render(
      <Button asChild>
        <LinkMock>Go</LinkMock>
      </Button>
    );
    expect(getByText("Go")).toBeInTheDocument();
  });

  it("should not crash if text only without asChild", () => {
    const { getByText } = render(<Button>Go</Button>);
    expect(getByText("Go")).toBeInTheDocument();
  });

  it("should render as button when asChild is false", () => {
    const { getByRole } = render(<Button>Click me</Button>);
    expect(getByRole("button")).toBeInTheDocument();
  });

  it("should render as child element when asChild is true", () => {
    const { getByRole } = render(
      <Button asChild>
        <LinkMock>Link text</LinkMock>
      </Button>
    );
    expect(getByRole("link")).toBeInTheDocument();
  });
});
