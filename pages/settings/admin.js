import { Checkbox, Container, Header, Input, Select, Table } from "semantic-ui-react";
import { connectToDB } from "../../db";
import { getUsers, getRoles } from "../../db";
import { getSession } from "next-auth/client";
import { useState } from "react";

const saveMaintainedUser = async (data) => {
  await fetch(`/api/admin/user`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const saveUserRoles = async (data) => {
  await fetch(`/api/admin/role`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

function RoleRow({ role }) {
  const [updatedRole, setUpdatedRole] = useState(role);

  const setValue = (name, value) => {
    const newValue = { ...updatedRole, [name]: value };
    setUpdatedRole(newValue);
    saveUserRoles(newValue);
  };

  const setPermissionValue = (name, value) => {
    const { permissions } = updatedRole;
    setValue("permissions", { ...permissions, [name]: value });
  };

  return (
    <Table.Row>
      <Table.Cell>{updatedRole.text}</Table.Cell>
      <Table.Cell>
        <Input
          value={updatedRole.maxDiscountPercent}
          onChange={(e, { value }) => setValue("maxDiscountPercent", value)}
        />
      </Table.Cell>
      <Table.Cell>
        <Checkbox
          checked={updatedRole.permissions.readList}
          onChange={(e, { checked }) => setPermissionValue("readList", checked)}
        />
      </Table.Cell>
      <Table.Cell>
        <Checkbox
          checked={updatedRole.permissions.createItem}
          onChange={(e, { checked }) => setPermissionValue("createItem", checked)}
        />
      </Table.Cell>
      <Table.Cell>
        <Checkbox
          checked={updatedRole.permissions.updateItem}
          onChange={(e, { checked }) => setPermissionValue("updateItem", checked)}
        />
      </Table.Cell>
      <Table.Cell>
        <Checkbox
          checked={updatedRole.permissions.deleteItem}
          onChange={(e, { checked }) => setPermissionValue("deleteItem", checked)}
        />
      </Table.Cell>
      <Table.Cell>
        <Checkbox
          checked={updatedRole.permissions.archiveItem}
          onChange={(e, { checked }) => setPermissionValue("archiveItem", checked)}
        />
      </Table.Cell>
      <Table.Cell>
        <Checkbox
          checked={updatedRole.permissions.displaySettings}
          onChange={(e, { checked }) => setPermissionValue("displaySettings", checked)}
        />
      </Table.Cell>
      <Table.Cell>
        <Checkbox
          checked={updatedRole.permissions.updateSettings}
          onChange={(e, { checked }) => setPermissionValue("updateSettings", checked)}
        />
      </Table.Cell>
    </Table.Row>
  );
}

function UserRow({ user, checkboxRoles }) {
  const [updatedUser, setUpdatedUser] = useState(user);
  return (
    <Table.Row>
      <Table.Cell>{updatedUser.name}</Table.Cell>
      <Table.Cell>{updatedUser.email}</Table.Cell>
      <Table.Cell>
        <Select
          value={updatedUser.role}
          onChange={(e, { value }) => {
            const newValue = { ...updatedUser, role: value };
            setUpdatedUser(newValue);
            saveMaintainedUser(newValue);
          }}
          options={checkboxRoles}
        />
      </Table.Cell>
      <Table.Cell>
        <Checkbox checked={updatedUser.admin} readOnly={true} disabled={true} />
      </Table.Cell>
      <Table.Cell>
        <Checkbox checked={updatedUser.technical} readOnly={true} disabled={true} />
      </Table.Cell>
    </Table.Row>
  );
}

export default function UserMaintainPage({ users, roles, checkboxRoles }) {
  return (
    <Container>
      <Header>Roles</Header>
      <Table striped compact celled color="orange">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell>maxDiscount</Table.HeaderCell>
            <Table.HeaderCell>readList</Table.HeaderCell>
            <Table.HeaderCell>createItem</Table.HeaderCell>
            <Table.HeaderCell>updateItem</Table.HeaderCell>
            <Table.HeaderCell>deleteItem</Table.HeaderCell>
            <Table.HeaderCell>archiveItem</Table.HeaderCell>
            <Table.HeaderCell>displaySettings</Table.HeaderCell>
            <Table.HeaderCell>updateSettings</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {roles.map((r) => (
            <RoleRow key={r._id} role={r} />
          ))}
        </Table.Body>
      </Table>

      <Header>Users</Header>
      <Table striped compact celled color="orange">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>e-mail</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell collapsing>is Admin</Table.HeaderCell>
            <Table.HeaderCell collapsing>is Tech User</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((u) => (
            <UserRow key={u.email} user={u} checkboxRoles={checkboxRoles} />
          ))}
        </Table.Body>
      </Table>
    </Container>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (!session || !session.user || !session.user.admin) {
    return { props: {} };
  }

  const { db } = await connectToDB();

  const users = (await getUsers(db)).map((u) => ({
    email: u.email,
    name: u.name,
    role: u.role,
    admin: u.admin || false,
    technical: u.technical || false,
  }));

  const roles = await getRoles(db);

  const checkboxRoles = roles.map((r) => ({
    text: r.text,
    value: r._id,
    key: r._id,
  }));

  return { props: { users, roles, checkboxRoles } };
}
