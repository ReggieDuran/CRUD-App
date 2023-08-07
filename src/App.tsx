import React, { useEffect, useState } from 'react';
import { User } from './interfaces/user';
import { useDisclosure } from '@mantine/hooks';
import {
  Drawer,
  Button,
  Table,
  TextInput,
  Divider,
} from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';

const userInitialState = {
  id: 0,
  firstName: '',
  lastName: '',
  maidenName: '',
  age: 0,
  gender: '',
  email: '',
  phone: '',
  username: '',
  password: '',
  birthDate: '',
  image: '',
  bloodGroup: '',
  height: 0,
  weight: 0,
  eyeColor: '',
  hair: {
    color: '',
    type: '',
  },
  domain: '',
  address: {
    address: '',
    city: '',
    coordinates: {
      lat: 0,
      lng: 0,
    },
    postalCode: '',
    state: '',
  },
  ip: '',
  macAddress: '',
  university: '',
  bank: {
    cardExpire: '',
    cardNumber: '',
    cardType: '',
    currency: '',
    iban: '',
  },
  company: {
    address: {
      address: '',
      city: '',
      coordinates: {
        lat: 0,
        lng: 0,
      },
      postalCode: '',
      state: '',
    },
    department: '',
    name: '',
    title: '',
  },
  ein: '',
  ssn: '',
  userAgent: '',
}

const App: React.FC = () => {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [newUserDrawer, setNewUserDrawer] = useState<boolean>(false);
  const [user, setUser] = useState<User>(userInitialState);
  const [inputs, setInputs] = useState<User>(userInitialState);

  const getUsers = () => {
    fetch('https://dummyjson.com/users')
      .then(response => response.json())
      .then(actualData => {
        setUsersData(actualData.users);
      }).catch(err => {
        console.log(err.message);
      });
  }

  useEffect(() => {
    getUsers();
  }, []);

  const setData = (e: { target: { name: string; value: string; }; }) => {
    const { name, value } = e.target;
    if (Object.keys(inputs.address).includes(name)) {
      setUser(prevState => {
        return {
          ...prevState,
          address: { ...prevState.address, [name]: value },
        }
      })
    } else if (Object.keys(inputs.address.coordinates).includes(name)) {
      setUser(prevState => {
        return {
          ...prevState,
          address: { ...prevState.address, coordinates: { ...prevState.address.coordinates, [name]: value } },
        }
      })
    } else if (Object.keys(inputs.bank).includes(name)) {
      setUser(prevState => {
        return {
          ...prevState,
          bank: { ...prevState.bank, [name]: value },
        }
      })
    } else if (name.includes("companyupdate")) {
      const newName = name.replace("companyupdate", "");
      setUser(prevState => {
        return {
          ...prevState,
          company: {
            ...prevState.company,
            [newName]: value,
            address: {
              ...prevState.company.address,
              [newName]: value,
              coordinates: {
                ...prevState.company.address.coordinates,
                [newName]: value
              }
            }
          },
        }
      })
    } else if (Object.keys(inputs.hair).includes(name)) {
      setUser(prevState => {
        return {
          ...prevState,
          hair: { ...prevState.hair, [name]: value },
        }
      })
    } else {
      setUser(prevState => {
        return {
          ...prevState,
          [name]: value
        }
      })
    }
  }

  const setNewUser = (e: { target: { name: string; value: string; }; }) => {
    const { name, value } = e.target;
    if (Object.keys(inputs.address).includes(name)) {
      setInputs(prevState => {
        return {
          ...prevState,
          address: { ...prevState.address, [name]: value },
        }
      })
    } else if (Object.keys(inputs.address.coordinates).includes(name)) {
      setInputs(prevState => {
        return {
          ...prevState,
          address: { ...prevState.address, coordinates: { ...prevState.address.coordinates, [name]: value } },
        }
      })
    } else if (Object.keys(inputs.bank).includes(name)) {
      setInputs(prevState => {
        return {
          ...prevState,
          bank: { ...prevState.bank, [name]: value },
        }
      })
    } else if (name.includes("company")) {
      const newName = name.replace("company", "");
      setInputs(prevState => {
        return {
          ...prevState,
          company: {
            ...prevState.company,
            [newName]: value,
            address: {
              ...prevState.company.address,
              [newName]: value,
              coordinates: {
                ...prevState.company.address.coordinates,
                [newName]: value
              }
            }
          },
        }
      })
    } else if (Object.keys(inputs.hair).includes(name)) {
      setInputs(prevState => {
        return {
          ...prevState,
          hair: { ...prevState.hair, [name]: value },
        }
      })
    } else {
      setInputs(prevState => {
        return {
          ...prevState,
          [name]: value
        }
      })
    }
  }

  const addNewUserHandler = () => {
    fetch('https://dummyjson.com/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs)
    })
      .then(res => res.json())
      .then(newUser => {
        setUsersData(prev => [newUser, ...prev]);
        close()
      }).catch(err => {
        console.log(err.message);
      });
  }

  const showDrawerHandler = () => {
    open();
    setNewUserDrawer(true);
    setInputs(userInitialState)
  }

  const editUserHandler = (id: number) => {
    open();
    setNewUserDrawer(false);
    const editNewUser = usersData.filter(user => user.id === id);
    if (editNewUser.length > 0) {
      setUser(editNewUser[0])
    } else {
      fetch(`https://dummyjson.com/users/${id}`)
        .then(response => response.json())
        .then(userDetails => {
          const newUser = usersData.filter(user => user.id === id);
          if (newUser.length > 0) {
            setUser(newUser[0])
          } else {
            setUser(userDetails);
          }
        }).catch(err => {
          console.log(err.message);
        });
    }
  }

  const deleteUserHandler = (id: number) => {
    const editNewUser = usersData.filter(user => user.id === id && user.id > 100);
    if (editNewUser.length > 0) {
      const updatedUsers = usersData.filter(user => user.id !== id);
      setUsersData(updatedUsers);
      close()
    } else {
      fetch(`https://dummyjson.com/users/${id}`, {
        method: 'DELETE',
      })
        .then(res => res.json())
        .then(actualData => {
          const updatedUsers = usersData.filter((user: { id: number; }) => user.id !== actualData.id);
          setUsersData(updatedUsers);
          close()
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }

  const updateUserData = (id: number) => {
    const editNewUser = usersData.filter(user => user.id === id && user.id > 100);
    if (editNewUser.length > 0) {
      const updatedUsers = usersData.map((users) => {
        if (users.id === id) {
          users = user
        }
        return users;
      });
      setUsersData(updatedUsers);
      close()
    } else {
      fetch(`https://dummyjson.com/users/${id}`, {
        method: 'PUT', /* or PATCH */
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
        .then(res => res.json())
        .then(actualData => {
          const updatedUsers = usersData.map((user) => {
            if (user.id === id) {
              user = actualData
            }
            return user;
          });

          setUsersData(updatedUsers);
          close()
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }

  return (
    <div className="App">
      <div className="top-container">
        <h1>Todo List</h1>
        <Button onClick={() => showDrawerHandler()}>Create New User</Button>
      </div>
      <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} sx={{ tableLayout: 'fixed' }} striped highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Image</th>
            <th>Birthdate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {usersData.map((task: User) => (
            <tr key={task.id} data-testid="user">
              <td>{task.firstName} {task.maidenName} {task.lastName}</td>
              <td>{task.email}</td>
              <td>{task.phone}</td>
              <td><img src={task.image} height="40" width="40" alt={task.firstName} /></td>
              <td>{task.birthDate}</td>
              <td>
                <Button leftIcon={<IconEdit size="1rem" />} onClick={() => editUserHandler(task.id)}>
                  Edit
                </Button>
                <Button leftIcon={<IconTrash size="1rem" />} onClick={() => deleteUserHandler(task.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {newUserDrawer ?
        <Drawer position="right" opened={opened} onClose={close} title="New User" className='new-user-drawer' size="xl">
          <TextInput label="ID" disabled value={inputs.id} onChange={setNewUser} name="id" placeholder="ID" />
          <Divider my="xs" label="Personal Details" />
          <div className="name-group">
            <TextInput data-autofocus label="First name" value={inputs.firstName} onChange={setNewUser} name="firstName" placeholder="First name" />
            <TextInput label="Maiden name" value={inputs.maidenName} onChange={setNewUser} name="maidenName" placeholder="Maiden name" />
            <TextInput label="Last name" value={inputs.lastName} onChange={setNewUser} name="lastName" placeholder="Last name" />
          </div>
          <div className='personal-details'>
            <TextInput label="Age" value={inputs.age} onChange={setNewUser} name="age" placeholder="Age" />
            <TextInput label="Gender" value={inputs.gender} onChange={setNewUser} name="gender" placeholder="Gender" />
            <TextInput label="Email" value={inputs.email} onChange={setNewUser} name="email" placeholder="Email" />
            <TextInput label="Phone" value={inputs.phone} onChange={setNewUser} name="phone" placeholder="Phone" />
            <TextInput label="Username" value={inputs.username} onChange={setNewUser} name="username" placeholder="Username" />
            <TextInput label="Password" value={inputs.password} onChange={setNewUser} name="password" placeholder="Password" type="password" />
            <TextInput label="Birth Date" value={inputs.birthDate} onChange={setNewUser} name="birthDate" placeholder="Birth Date" />
            <TextInput label="Image" value={inputs.image} onChange={setNewUser} name="image" placeholder="Image" />
            <TextInput label="Blood Group" value={inputs.bloodGroup} onChange={setNewUser} name="bloodGroup" placeholder="Blood Group" />
            <TextInput label="Height" value={inputs.height} onChange={setNewUser} name="height" placeholder="Height" />
            <TextInput label="Weight" value={inputs.weight} onChange={setNewUser} name="weight" placeholder="Weight" />
            <TextInput label="Eye color" value={inputs.eyeColor} onChange={setNewUser} name="eyeColor" placeholder="Eye color" />
            <TextInput label="Hair Color" value={inputs.hair.color} onChange={setNewUser} name="color" placeholder="Hair Color" />
            <TextInput label="Hair Type" value={inputs.hair.type} onChange={setNewUser} name="type" placeholder="Hair Type" />
            <TextInput label="Domain" value={inputs.domain} onChange={setNewUser} name="domain" placeholder="Domain" />
          </div>

          <Divider my="xs" label="Personal Address Details" />
          <div className='address-details'>
            <TextInput label="Address" value={inputs.address.address} onChange={setNewUser} name="address" placeholder="Address" />
            <TextInput label="City" value={inputs.address.city} onChange={setNewUser} name="city" placeholder="City" />
            <TextInput label="Coordinates - Lat" value={inputs.address.coordinates.lat} onChange={setNewUser} name="lat" placeholder="Coordinates - Lat" />
            <TextInput label="Coordinates - Lng" value={inputs.address.coordinates.lng} onChange={setNewUser} name="lng" placeholder="Coordinates - Lat" />
            <TextInput label="Postal Code" value={inputs.address.postalCode} onChange={setNewUser} name="postalCode" placeholder="Postal Code" />
            <TextInput label="State" value={inputs.address.state} onChange={setNewUser} name="state" placeholder="State" />
            <TextInput label="IP" value={inputs.ip} onChange={setNewUser} name="ip" placeholder="IP" />
            <TextInput label="Mac Address" value={inputs.macAddress} onChange={setNewUser} name="macAddress" placeholder="Mac Address" />
            <TextInput label="University" value={inputs.university} onChange={setNewUser} name="university" placeholder="University" />
          </div>

          <Divider my="xs" label="Bank Details" />
          <div className='bank-details'>
            <TextInput label="Card Expiration" value={inputs.bank.cardExpire} onChange={setNewUser} name="cardExpire" placeholder="Card Expiration" />
            <TextInput label="Card Number" value={inputs.bank.cardNumber} onChange={setNewUser} name="cardNumber" placeholder="Card Number" />
            <TextInput label="Card Type" value={inputs.bank.cardType} onChange={setNewUser} name="cardType" placeholder="Card Type" />
            <TextInput label="Currency" value={inputs.bank.currency} onChange={setNewUser} name="currency" placeholder="Currency" />
            <TextInput label="IBAN" value={inputs.bank.iban} onChange={setNewUser} name="iban" placeholder="IBAN" />
          </div>

          <Divider my="xs" label="Company Details" />
          <div className='company-details'>
            <TextInput label="Address" value={inputs.company.address.address} onChange={setNewUser} name="companyaddress" placeholder="Address" />
            <TextInput label="City" value={inputs.company.address.city} onChange={setNewUser} name="companycity" placeholder="City" />
            <TextInput label="Coordinates - Lat" value={inputs.company.address.coordinates.lat} onChange={setNewUser} name="companylat" placeholder="Coordinates - Lat" />
            <TextInput label="Coordinates - Lng" value={inputs.company.address.coordinates.lng} onChange={setNewUser} name="companylng" placeholder="Coordinates - Lng" />
            <TextInput label="Postal Code" value={inputs.company.address.postalCode} onChange={setNewUser} name="companypostalCode" placeholder="Postal Code" />
            <TextInput label="State" value={inputs.company.address.state} onChange={setNewUser} name="companystate" placeholder="State" />
            <TextInput label="Department" value={inputs.company.department} onChange={setNewUser} name="companydepartment" placeholder="Department" />
            <TextInput label="Name" value={inputs.company.name} onChange={setNewUser} name="companyname" placeholder="Name" />
            <TextInput label="Title" value={inputs.company.title} onChange={setNewUser} name="companytitle" placeholder="Title" />
            <TextInput label="EIN" value={inputs.ein} onChange={setNewUser} name="ein" placeholder="EIN" />
            <TextInput label="SSN" value={inputs.ssn} onChange={setNewUser} name="ssn" placeholder="SSN" />
            <TextInput label="User Agent" value={inputs.userAgent} onChange={setNewUser} name="userAgent" placeholder="User Agent" />
          </div>
          <div className='button-group'>
            <Button onClick={addNewUserHandler}>Add User</Button>
            <Button onClick={close}>Cancel</Button>
          </div>

        </Drawer>
        :
        <Drawer position="left" opened={opened} onClose={close} title="Edit User" className='edit-user-drawer' size="xl">
          <TextInput label="ID" disabled value={user.id} onChange={setData} name="id" placeholder="ID" />
          <Divider my="xs" label="Personal Details" />
          <div className="name-group">
            <TextInput data-autofocus label="First name" value={user.firstName} onChange={setData} name="firstName" placeholder="First name" />
            <TextInput label="Maiden name" value={user.maidenName} onChange={setData} name="maidenName" placeholder="Maiden name" />
            <TextInput label="Last name" value={user.lastName} onChange={setData} name="lastName" placeholder="Last name" />
          </div>
          <div className='personal-details'>
            <TextInput label="Age" value={user.age} onChange={setData} name="age" placeholder="Age" />
            <TextInput label="Gender" value={user.gender} onChange={setData} name="gender" placeholder="Gender" />
            <TextInput label="Email" value={user.email} onChange={setData} name="email" placeholder="Email" />
            <TextInput label="Phone" value={user.phone} onChange={setData} name="phone" placeholder="Phone" />
            <TextInput label="Username" value={user.username} onChange={setData} name="username" placeholder="Username" />
            <TextInput label="Password" value={user.password} onChange={setData} name="password" placeholder="Password" type="password" />
            <TextInput label="Birth Date" value={user.birthDate} onChange={setData} name="birthDate" placeholder="Birth Date" />
            <TextInput label="Image" value={user.image} onChange={setData} name="image" placeholder="Image" />
            <TextInput label="Blood Group" value={user.bloodGroup} onChange={setData} name="bloodGroup" placeholder="Blood Group" />
            <TextInput label="Height" value={user.height} onChange={setData} name="height" placeholder="Height" />
            <TextInput label="Weight" value={user.weight} onChange={setData} name="weight" placeholder="Weight" />
            <TextInput label="Eye color" value={user.eyeColor} onChange={setData} name="eyeColor" placeholder="Eye color" />
            <TextInput label="Hair Color" value={user.hair.color} onChange={setData} name="color" placeholder="Hair Color" />
            <TextInput label="Hair Type" value={user.hair.type} onChange={setData} name="type" placeholder="Hair Type" />
            <TextInput label="Domain" value={user.domain} onChange={setData} name="domain" placeholder="Domain" />
          </div>

          <Divider my="xs" label="Personal Address Details" />
          <div className='address-details'>
            <TextInput label="Address" value={user.address.address} onChange={setData} name="address" placeholder="Address" />
            <TextInput label="City" value={user.address.city} onChange={setData} name="city" placeholder="City" />
            <TextInput label="Coordinates - Lat" value={user.address.coordinates.lat} onChange={setData} name="lat" placeholder="Coordinates - Lat" />
            <TextInput label="Coordinates - Lng" value={user.address.coordinates.lng} onChange={setData} name="lng" placeholder="Coordinates - Lat" />
            <TextInput label="Postal Code" value={user.address.postalCode} onChange={setData} name="postalCode" placeholder="Postal Code" />
            <TextInput label="State" value={user.address.state} onChange={setData} name="state" placeholder="State" />
            <TextInput label="IP" value={user.ip} onChange={setData} name="ip" placeholder="IP" />
            <TextInput label="Mac Address" value={user.macAddress} onChange={setData} name="macAddress" placeholder="Mac Address" />
            <TextInput label="University" value={user.university} onChange={setData} name="university" placeholder="University" />
          </div>

          <Divider my="xs" label="Bank Details" />
          <div className='bank-details'>
            <TextInput label="Card Expiration" value={user.bank.cardExpire} onChange={setData} name="cardExpire" placeholder="Card Expiration" />
            <TextInput label="Card Number" value={user.bank.cardNumber} onChange={setData} name="cardNumber" placeholder="Card Number" />
            <TextInput label="Card Type" value={user.bank.cardType} onChange={setData} name="cardType" placeholder="Card Type" />
            <TextInput label="Currency" value={user.bank.currency} onChange={setData} name="currency" placeholder="Currency" />
            <TextInput label="IBAN" value={user.bank.iban} onChange={setData} name="iban" placeholder="IBAN" />
          </div>

          <Divider my="xs" label="Company Details" />
          <div className='company-details'>
            <TextInput label="Address" value={user.company.address.address} onChange={setData} name="companyupdateaddress" placeholder="Address" />
            <TextInput label="City" value={user.company.address.city} onChange={setData} name="companyupdatecity" placeholder="City" />
            <TextInput label="Coordinates - Lat" value={user.company.address.coordinates.lat} onChange={setData} name="companyupdatelat" placeholder="Coordinates - Lat" />
            <TextInput label="Coordinates - Lng" value={user.company.address.coordinates.lng} onChange={setData} name="companyupdatelng" placeholder="Coordinates - Lng" />
            <TextInput label="Postal Code" value={user.company.address.postalCode} onChange={setData} name="companyupdatepostalCode" placeholder="Postal Code" />
            <TextInput label="State" value={user.company.address.state} onChange={setData} name="companyupdatestate" placeholder="State" />
            <TextInput label="Department" value={user.company.department} onChange={setData} name="datedepartment" placeholder="Department" />
            <TextInput label="Name" value={user.company.name} onChange={setData} name="name" placeholder="Name" />
            <TextInput label="Title" value={user.company.title} onChange={setData} name="title" placeholder="Title" />
            <TextInput label="EIN" value={user.ein} onChange={setData} name="ein" placeholder="EIN" />
            <TextInput label="SSN" value={user.ssn} onChange={setData} name="ssn" placeholder="SSN" />
            <TextInput label="User Agent" value={user.userAgent} onChange={setData} name="userAgent" placeholder="User Agent" />
          </div>
          <div className='button-group'>
            <Button onClick={() => updateUserData(user.id)}>Update User</Button>
            <Button onClick={close}>Cancel</Button>
          </div>
        </Drawer>
      }
    </div>
  );
}

export default App;
