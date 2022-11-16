import React from "react";
import { Header as AhaHeader, Dropdown, Icon } from "@ahaui/react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "assets/images/logo.svg";
import { useAppSelector } from "hooks";
import { userSelector } from "redux/reducers/user.reducer";

import styles from "./Header.module.scss";

const Header = () => {
  const user = useAppSelector(userSelector);

  return (
    <AhaHeader fullWidth className={styles.header}>
      <AhaHeader.Brand>
        <Link to="/">
          <Logo width={100} height={36} />
        </Link>
      </AhaHeader.Brand>

      <AhaHeader.Main>
        <AhaHeader.Right>
          {user.isLoggedIn && (
            <>
              <Dropdown alignRight className="u-marginLeftExtraSmall">
                <Dropdown.Toggle className="u-textLight u-lineHeightNone">
                  <Icon name="contact" size="medium" />
                </Dropdown.Toggle>
                <Dropdown.Container
                  className={`u-cursorPointer u-marginNone u-minWidth-0`}
                  additionalStyles={{ minWidth: "unset" }}
                >
                  <Dropdown.Item className="u-paddingVerticalExtraSmall u-paddingHorizontalExtraSmall">
                    <Icon name="power" size="small" />
                    <span className="u-marginLeftExtraSmall">Logout</span>
                  </Dropdown.Item>
                </Dropdown.Container>
              </Dropdown>
            </>
          )}

          {!user.isLoggedIn && (
            <div className="u-flex u-alignItemsCenter">
              <Link
                className="hover:u-textPrimary hover:u-textUnderline u-textDark"
                to="/login"
              >
                Login
              </Link>
              <Link
                className="hover:u-textPrimary hover:u-textUnderline u-textDark u-marginLeftSmall"
                to="/signup"
              >
                Register
              </Link>
            </div>
          )}
        </AhaHeader.Right>
      </AhaHeader.Main>
    </AhaHeader>
  );
};

export default Header;
