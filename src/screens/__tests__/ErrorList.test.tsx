import { render } from "@testing-library/react-native";
import ErrorList from "../ErrorList";

jest.mock("react-i18next", () => ({
  withTranslation: () => (Component: any) => (props: any) => (
    <Component {...props} t={(key: string) => key} />
  ),
}));

describe("ErrorList", () => {
    it("renders translated text correctly", () => {
    const { getByText } = render(<ErrorList />);
    expect(getByText("noError")).toBeTruthy();
  });
    it('matches the rendered snapshot', () => {
    const tree = render(<ErrorList />).toJSON();
    expect(tree).toMatchSnapshot();
  });

})