import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import { setAuthRole } from '../../redux/slices/family/authSlice';
import { useDispatch } from 'react-redux';

export function NavBar() {

  const dispatch = useDispatch();

  const isAdminRole: boolean = useSelector(
    (state: { authReducer: { isAdmin: boolean} }) =>
      state.authReducer.isAdmin
  );

  const ROLES = {
    admin: 'ADMIN',
    reg: 'REGISTRAR'
  };

  useEffect(() => {
    console.log("DXD : isADmin", isAdminRole);
  }, [isAdminRole]);

  const handleRoleChange = (isAdmin: boolean) => {
    console.log("DXD: handle change" , isAdmin);
    dispatch(setAuthRole(isAdmin));
  }

  return (
    <Wrapper>
      <NavBrand>
        <span>student management system</span>
      </NavBrand>
      <RoleMenuContainer>
        <RoleMenu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {isAdminRole ? ROLES.admin : ROLES.reg}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => handleRoleChange(true)}>{ROLES.admin}</MenuItem>
              <MenuItem onClick={() => handleRoleChange(false)}>{ROLES.reg}</MenuItem>
            </MenuList>
          </Menu>
        </RoleMenu>
      </RoleMenuContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  vertical-align: middle;
  justify-content: space-between;
  flex-direction: row;
  background-color: #2980b9;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 30px 90px;
`;

const NavBrand = styled.div`
  font-weight: bold;
  color: black;
  font-size: 3.375rem;
  text-align: center;
  align-items: center;
  vertical-align: middle;
  min-height: 100%;
  display: flex;
  margin-left: 20px;
  span {
    font-size: 1.525rem;
    color: #dff9fb;
  }
`;

const RoleMenuContainer = styled.div`
  display: flex;
  align-items: center;

  span {
    color: #dff9fb;
  }
`;

const RoleMenu = styled.div`
  margin-left: 20px;
  margin-right: 20px;

  span {
    color: #2d2d2d;
  }
`;
