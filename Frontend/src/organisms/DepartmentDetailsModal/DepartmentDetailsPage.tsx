import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import { Table, Button, FlexboxGrid, Col } from 'rsuite';
import { useNavigate } from 'react-router-dom';

const { Column, HeaderCell, Cell } = Table;

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    active: boolean;
}

interface Department {
    organisation_name: string;
    users: User[];
}

const DepartmentDetailsPage = () => {
    const cookies = new Cookies();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [department, setDepartment] = useState<Department | null>(null);

    useEffect(() => {
        const fetchDepartmentDetails = async () => {
            const token = cookies.get('admintoken');
            try {
                const response = await fetch(`http://localhost:5000/admin/usersindepartment?organisationName=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();                    
                    const users = data.users.map((user: any) => ({
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        active: user.active,
                    }));
                    setDepartment({ organisation_name: id, users });
                } else {
                    throw new Error('Failed to fetch department details');
                }
            } catch (error) {
                console.error('Error fetching department details:', error);
                // Handle error
            }
        };

        fetchDepartmentDetails();
    }, []);

    const handleBack = () => {
        navigate("/adminhome");
    };

    const logout = () => {
        cookies.remove('token');
        navigate('/userlogin');
    };

    return (
        
        <div className="container mx-auto">
            <div className="bg-indigo-700 text-white text-center p-4 flex justify-between">
                <FlexboxGrid justify="start">
                    <FlexboxGrid.Item as={Col} colspan={24} md={6} justify="start">
                        <Link to="/adminhome">
                            <Button appearance="ghost" className="text-white hover:font-bold hover:text-white">Back</Button>
                        </Link>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item as={Col} colspan={24}>
                        <p style={{ fontWeight: "bold", fontSize: "28px" }}>Organisation Details</p>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
                <FlexboxGrid justify="end">
                    <FlexboxGrid.Item as={Col} md={20} justify="end" smHidden>
                        <Button appearance="ghost" onClick={logout} className="hover:text-white font-semibold">
                            Logout
                        </Button>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
            {department && (
                <div className="mt-4">
                    <h2 className="text-xl font-bold mb-2 text-center">Organisation Name: {department.organisation_name}</h2>
                    <div className="mx-auto" style={{ maxWidth: "600px" }}>
                        <Table
                            virtualized={true}
                            height={500}
                            bordered
                            data={department.users}
                            hover
                            fillHeight
                            showHeader
                            autoHeight
                            cellBordered
                        >
                            <Column width={100} align="center">
                                <HeaderCell>Serial Number</HeaderCell>
                                <Cell>
                                    {(rowData, rowIndex) => (
                                        <span>{rowIndex + 1}</span>
                                    )}
                                </Cell>
                            </Column>
                            <Column width={200} align="center">
                                <HeaderCell>Name</HeaderCell>
                                <Cell>
                                    {rowData => `${rowData.firstName} ${rowData.lastName}`}
                                </Cell>
                            </Column>
                            <Column width={200} align="center">
                                <HeaderCell>Email</HeaderCell>
                                <Cell dataKey="email" />
                            </Column>
                            <Column width={100} align="center">
                                <HeaderCell>Active</HeaderCell>
                                <Cell>
                                    {rowData => (
                                        <span className={rowData.active ? "text-green-500" : "text-red-500"}>
                                            {rowData.active ? 'Yes' : 'No'}
                                        </span>
                                    )}
                                </Cell>
                            </Column>
                        </Table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentDetailsPage;
