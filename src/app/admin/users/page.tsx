'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  User as NextUIUser, 
  Chip, 
  Button, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem
} from '@nextui-org/react';
import { User as UserW, Profile2User, Trash } from 'iconsax-react';
import { getUsers, getUserDetails, deleteUser, banUser, terminateSession } from './_actions/usersActions';
import { Account, User, UserType } from '@prisma/client';

type UserWithAccounts = User & { accounts: Account[] };
const getAvatarSrc = (user: any) => user?.image;

export default function UserManagement() {
  const [users, setUsers] = useState<UserWithAccounts[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithAccounts[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithAccounts | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filter, setFilter] = useState({ userType: '', accountType: '' });
  const [sortBy, setSortBy] = useState('');
  
  const fetchUsers = useCallback(async () => {
    const fetchedUsers = await getUsers(
      filter.userType as UserType || undefined,
      filter.accountType as 'oidc' | 'credentials' || undefined
    );
    setUsers(fetchedUsers);
  }, [filter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const sortUsers = useCallback((usersToSort: any[]) => {
    return [...usersToSort].sort((a, b) => {
      switch (sortBy) {
        case 'nameAsc':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'nameDesc':
          return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
        case 'creationDateAsc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'creationDateDesc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'lastLoginDateAsc':
          return new Date(a.lastLoginAt || 0).getTime() - new Date(b.lastLoginAt || 0).getTime();
        case 'lastLoginDateDesc':
          return new Date(b.lastLoginAt || 0).getTime() - new Date(a.lastLoginAt || 0).getTime();
        default:
          return 0;
      }
    });
  }, [sortBy]);

  useEffect(() => {
    const sorted = sortUsers(users);
    setFilteredUsers(sorted);
  }, [users, sortBy, sortUsers]);

  const handleViewDetails = async (user: UserWithAccounts) => {
    setSelectedUser(user);
    const details = await getUserDetails(user.id);
    setUserDetails(details);
    onOpen();
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteUser(userId);
    fetchUsers();
  };

  const handleBanUser = async (userId: string) => {
    await banUser(userId);
    fetchUsers();
  };

  const handleTerminateSession = async (userId: string) => {
    await terminateSession(userId);
    fetchUsers();
  };

  const columns = [
    { name: 'USER', uid: 'user' },
    { name: 'USER TYPE', uid: 'userType' },
    { name: 'ACCOUNT TYPE', uid: 'accountType' },
    { name: 'ACTIONS', uid: 'actions' },
  ];

  const renderCell = (user: UserWithAccounts, columnKey: React.Key) => {
    switch (columnKey) {
      case 'user':
        return (
          <NextUIUser
            avatarProps={{ src: getAvatarSrc(user), name: "", showFallback: true }}
            name={`${user.firstName} ${user.lastName}`}
            description={user.email}
          />
        );
      case 'userType':
        return <Chip>{user.userType}</Chip>;
      case 'accountType':
        return <Chip>{user.accounts[0]?.provider || 'Credentials'}</Chip>;
      case 'actions':
        return (
          <div className="flex items-center gap-2">
            <Button color="primary"  className='text-white' aria-label="View" onClick={() => handleViewDetails(user)}>
              View
            </Button>
            
            <Button  onClick={() => handleTerminateSession(user.id)}>
              Terminate Session
            </Button>
            <Button  color='warning' className='text-black' onClick={() => handleBanUser(user.id)}>
              Ban User
            </Button>
            <Button isIconOnly color="danger" aria-label="Delete" onClick={() => handleDeleteUser(user.id)}>
              <Trash size={20} />
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="mb-4 flex gap-4">
        <Select
          placeholder="User Type"
          selectedKeys={filter.userType ? [filter.userType] : []}
          onChange={(e) => setFilter(prev => ({ ...prev, userType: e.target.value }))}
        >
          <SelectItem key="" value="">All User Types</SelectItem>
          <SelectItem key="STUDENT" value="STUDENT">Student</SelectItem>
          <SelectItem key="NON_STUDENT" value="NON_STUDENT">Non-Student</SelectItem>
        </Select>
        <Select
          placeholder="Account Type"
          selectedKeys={filter.accountType ? [filter.accountType] : []}
          onChange={(e) => setFilter(prev => ({ ...prev, accountType: e.target.value }))}
        >
          <SelectItem key="" value="">All Account Types</SelectItem>
          <SelectItem key="oidc" value="oidc">OAuth</SelectItem>
          <SelectItem key="credentials" value="credentials">Credentials</SelectItem>
        </Select>
        <Select
          placeholder="Sort By"
          selectedKeys={sortBy ? [sortBy] : []}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <SelectItem key="nameAsc" value="nameAsc">Name (Asc)</SelectItem>
          <SelectItem key="nameDesc" value="nameDesc">Name (Desc)</SelectItem>
          <SelectItem key="creationDateAsc" value="creationDateAsc">Creation Date (Asc)</SelectItem>
          <SelectItem key="creationDateDesc" value="creationDateDesc">Creation Date (Desc)</SelectItem>
          <SelectItem key="lastLoginDateAsc" value="lastLoginDateAsc">Last Login Date (Asc)</SelectItem>
          <SelectItem key="lastLoginDateDesc" value="lastLoginDateDesc">Last Login Date (Desc)</SelectItem>
        </Select>
      </div>
      <Table aria-label="User management table">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
        </TableHeader>
        <TableBody items={filteredUsers}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>User Details</ModalHeader>
              <ModalBody>
                {userDetails && (
                  <div>
                    <p><strong>Name:</strong> {userDetails.firstName} {userDetails.lastName}</p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>User Type:</strong> {userDetails.userType}</p>
                    <p><strong>Account :</strong> {userDetails.accounts[0]?.provider || 'Credentials'}</p>
                    <p><strong>Beams Points:</strong> {userDetails.beamPoints[0]?.beams || 0}</p>
                    <p><strong>Current Level:</strong> {userDetails.beamPoints[0]?.level?.name || 'Newbie'}</p>
                    <p><strong>Unlocked Achievements:</strong> {userDetails.userAchievements.map((ua: any) => ua.achievement.name).join(', ')}</p>
                    <p><strong>Last Login:</strong> {userDetails.lastLoginAt ? new Date(userDetails.lastLoginAt).toLocaleString() : 'N/A'}</p>
                    <p><strong>Last Login IP:</strong> {userDetails.lastLoginIp || 'N/A'}</p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}


