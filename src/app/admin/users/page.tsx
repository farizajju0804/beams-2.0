'use client'
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
import { getUsers, getUserDetails, deleteUser, banUser, terminateSession, terminateAllSessions } from './_actions/usersActions';
import { Account, User, UserType } from '@prisma/client';
import toast, { Toaster } from 'react-hot-toast';

type UserWithAccounts = User & { accounts: Account[] };
const getAvatarSrc = (user: any) => user?.image;

export default function UserManagement() {
  const [users, setUsers] = useState<UserWithAccounts[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithAccounts[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithAccounts | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const [filter, setFilter] = useState({ userType: '', accountType: '' });
  const [sortBy, setSortBy] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ type: string; userId: string } | null>(null);
  const [confirmAllAction, setConfirmAllAction] = useState(false);
  const fetchUsers = useCallback(async () => {
    try {
      const fetchedUsers = await getUsers(
        filter.userType as UserType || undefined
      );
      console.log(fetchedUsers);
      // Filter users based on account type
      const filteredUsers = fetchedUsers.filter(user => {
        if (filter.accountType === 'credentials') {
          // Filter users who have no accounts or have accounts that are not 'oidc'
          return user.accounts.length === 0 || !user.accounts.some(account => account.type === 'oidc');
        } else if (filter.accountType === 'oidc') {
          // Filter users who have accounts of 'oidc'
          return user.accounts.some(account => account.type === 'oidc');
        }
        // If no account type is selected, return all users
        return true;
      });
  
      setUsers(filteredUsers);
      console.log(filteredUsers)
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  }, [filter]);
  
  

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const sortUsers = useCallback((usersToSort: UserWithAccounts[]) => {
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
    try {
      const details = await getUserDetails(user.id);
      setUserDetails(details);
      onDetailsOpen();
    } catch (error) {
      toast.error('Failed to fetch user details');
    }
  };

  const handleDeleteUser = (userId: string) => {
    setConfirmAction({ type: 'delete', userId });
    onConfirmOpen();
  };

  const handleBanUser = (userId: string) => {
    setConfirmAction({ type: 'ban', userId });
    onConfirmOpen();
  };

  const handleTerminateSession = (userId: string) => {
    setConfirmAction({ type: 'terminate', userId });
    onConfirmOpen();
  };
  
  const handleTerminateAllSessions = async () => {
    try {
      await terminateAllSessions();
      toast.success('All user sessions terminated successfully');
      fetchUsers();  // Optional: Refresh user list if necessary
    } catch (error) {
      toast.error('Failed to terminate all sessions');
    } finally {
      setConfirmAllAction(false);  // Close the modal after action
    }
  };

  const openConfirmAllSessionsModal = () => {
    setConfirmAllAction(true);  // Open the confirmation modal
  };

  const closeConfirmAllSessionsModal = () => {
    setConfirmAllAction(false);  // Close modal without action
  };

  const executeAction = async () => {
    if (!confirmAction) return;

    const { type, userId } = confirmAction;
    try {
      switch (type) {
        case 'delete':
          await deleteUser(userId);
          toast.success('User deleted successfully');
          break;
        case 'ban': 
          await banUser(userId);
          toast.success('User banned successfully');
          break;
        case 'terminate':
          await terminateSession(userId);
          toast.success('User session terminated successfully');
          break;
      }
      fetchUsers();
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    } finally {
      setConfirmAction(null);
      onConfirmClose();
    }
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
            avatarProps={{ src: getAvatarSrc(user), name: `${user.firstName} ${user.lastName}`, showFallback: true }}
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
            <Button color="primary" className='text-white' aria-label="View" onPress={() => handleViewDetails(user)}>
              View
            </Button>
            <Button onPress={() => handleTerminateSession(user.id)}>
              Terminate Session
            </Button>
            <Button color='warning' className='text-black' onPress={() => handleBanUser(user.id)}>
              Ban User
            </Button>
            <Button isIconOnly color="danger" aria-label="Delete" onPress={() => handleDeleteUser(user.id)}>
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
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <Button className ="my-4" color="danger" onPress={openConfirmAllSessionsModal}>
          Terminate All Sessions
        </Button>
      <div className="mb-4 flex  gap-4">
        <Select
        className='flex flex-wrap w-full'
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
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="2xl">
        <ModalContent>
          <ModalHeader>User Details</ModalHeader>
          <ModalBody>
            {userDetails && (
              <div>
                <p><strong>Name:</strong> {userDetails.firstName} {userDetails.lastName}</p>
                <p><strong>Email:</strong> {userDetails.email}</p>
                <p><strong>User Type:</strong> {userDetails.userType}</p>
                <p><strong>Account:</strong> {userDetails.accounts[0]?.provider || 'Credentials'}</p>
                <p><strong>Beams Points:</strong> {userDetails.beamPoints[0]?.beams || 0}</p>
                <p><strong>Current Level:</strong> {userDetails.beamPoints[0]?.level?.name || 'Newbie'}</p>
                <p><strong>Unlocked Achievements:</strong> {userDetails.userAchievements.map((ua: any) => ua.achievement.name).join(', ')}</p>
                <p><strong>Last Login:</strong> {userDetails.lastLoginAt ? new Date(userDetails.lastLoginAt).toLocaleString() : 'N/A'}</p>
                <p><strong>Last Login IP:</strong> {userDetails.lastLoginIp || 'N/A'}</p>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={onDetailsClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose}>
        <ModalContent>
          <ModalHeader>Confirm Action</ModalHeader>
          <ModalBody>
            {confirmAction?.type === 'delete' && <p>Are you sure you want to delete this user?</p>}
            {confirmAction?.type === 'ban' && <p>Are you sure you want to ban this user?</p>}
            {confirmAction?.type === 'terminate' && <p>Are you sure you want to terminate this user&apos;s session?</p>}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={executeAction}>
              Confirm
            </Button>
            <Button color="default" onPress={onConfirmClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={confirmAllAction} onClose={closeConfirmAllSessionsModal}>
        <ModalContent>
          <ModalHeader>Confirm Termination of All Sessions</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to terminate all active user sessions?</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={handleTerminateAllSessions}>
              Confirm
            </Button>
            <Button color="default" onPress={closeConfirmAllSessionsModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}