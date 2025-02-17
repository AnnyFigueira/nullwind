import { NullstackClientContext, NullstackFunctionalComponent } from "nullstack";

import { ComponentProps } from "../types";
import useThemeProvider from "../useTheme";
interface TabProps extends ComponentProps {
  children?: NullstackClientContext<TabItemProps>[];
  onchange?: (index: number) => void;
}

const Tab = ({
  children,
  class: klass,
  onchange,
  theme,
  useTheme = useThemeProvider(),
}: NullstackClientContext<TabProps>) => {
  const classes = useTheme(theme).tab;

  return (
    <div class={klass}>
      <ul class={classes.list.base}>
        {children.map((child, idx) => {
          if (!child.attributes?.title) return false;

          return (
            <li>
              <a
                class={[
                  classes.list.item.base,
                  child.attributes?.active && classes.list.item.active,
                ]}
                onclick={() => onchange && onchange(idx)}
              >
                {child.attributes?.title}
              </a>
            </li>
          );
        })}
      </ul>
      <div class={classes.panel}>{children.filter((child) => child.attributes?.active)}</div>
    </div>
  );
};

interface TabItemProps {
  active?: boolean;
  attributes?: TabItemProps;
  title?: string;
}

Tab.Item = ({ children }) => <div>{children}</div>;

export default Tab as NullstackFunctionalComponent<TabProps>;
