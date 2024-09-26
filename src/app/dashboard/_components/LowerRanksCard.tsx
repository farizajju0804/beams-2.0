import React from 'react';
import { Table, Avatar, TableHeader, TableBody, TableRow, TableCell, TableColumn } from "@nextui-org/react";

interface LowerRanksTableProps {
  users: any[];
  userPosition: number | undefined;
}

const LowerRanksTable: React.FC<LowerRanksTableProps> = ({ users, userPosition }) => {
  const lowerRankedUsers = users.slice(3, 10);

  const columns = [
    { key: "rank", label: "RANK" },
    { key: "user", label: "NAME" },
    { key: "points", label: "POINTS" },
  ];

  const renderCell = (user: any, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof typeof user];

    switch (columnKey) {
      case "rank":
        return (
          <div
            className={`flex justify-center items-center w-8 h-8 rounded-full ${
              user.rank === userPosition ? "bg-secondary-2" : "bg-text"
            }`}
          >
            <span className="text-sm text-background font-bold">{user.rank}</span>
          </div>
        );
      case "user":
        return (
          <div className="flex items-center">
            <Avatar
              src={user?.user?.image || undefined}
              showFallback
              alt="profile"
              className="w-8 h-8 mr-2 flex-shrink-0"
            />
            <span className='text-wrap flex-grow font-medium text-sm md:text-base'>{`${user.user?.firstName} ${user.user?.lastName}`}</span>
          </div>
        );
      case "points":
        return <span className='text-wrap text-xs md:text-sm'>{user.points}</span>;
      default:
        return cellValue;
    }
  };

  return (
    <Table
      aria-label="Lower Ranks Table"
      className="max-w-2xl mx-auto mt-8"
      selectionMode="none"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn 
            key={column.key}
            align={column.key === "rank" ? "center" : column.key === "points" ? "end" : "start"}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={lowerRankedUsers}>
        {(user) => (
          <TableRow 
            key={user.id}
            className={`my-2 ${user.rank === userPosition ? "font-bold  font-poppins" : ""}`}
          >
            {(columnKey) => (
              <TableCell className={`py-4 ${columnKey === "points" ? "text-right" : ""}`}>
                <span className={user.rank === userPosition ? "text-secondary-2" : ""}>
                  {renderCell(user, columnKey)}
                </span>
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default LowerRanksTable;