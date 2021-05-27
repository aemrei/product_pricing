import { Checkbox, Container, Header, Select, Table } from "semantic-ui-react";
import { connectToDB } from "../../db";
import { getUsers, getRoles } from "../../db";
import { getSession } from "next-auth/client";
import { useState } from "react";

const saveMaintainedUser = async (data) => {
  await fetch(`/api/user`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

function UserRow({ user, roles }) {
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
          options={roles}
        />
      </Table.Cell>
      <Table.Cell>
        <Checkbox checked={updatedUser.admin} readOnly={true} disabled={true} />
      </Table.Cell>
    </Table.Row>
  );
}

export default function UserMaintainPage({ users, roles }) {
  return (
    <Container text>
      <Header>Users</Header>
      <Table striped compact celled color="orange">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>e-mail</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell collapsing>is Admin</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((u) => (
            <UserRow key={u.email} user={u} roles={roles} />
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
    admin: u.admin,
  }));

  const roles = (await getRoles(db)).map((r) => ({
    text: r.text,
    value: r._id,
    key: r._id,
  }));

  return { props: { users, roles } };
}
