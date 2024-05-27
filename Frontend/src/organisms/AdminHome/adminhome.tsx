import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Cookies } from 'react-cookie';
import 'react-toastify/dist/ReactToastify.css';
import { FiFilter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import styles from './adminhome.module.scss';
import { Button, Modal, Table, Nav, Pagination, Input } from 'rsuite';
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';
import { Department, Ticket, FormData, FilterOptions, NavbarProps } from '../../typings/AdminHome'
import { FaEye } from "react-icons/fa";
import { fetch_Departments, handle_Delete_Department, handle_Save_Edited_Department, handle_Submit, organisation_stats } from '../../services/Admin';
import ExitIcon from '@rsuite/icons/Exit';
import { FaBug, FaTasks, FaBook } from "react-icons/fa"
const { Column, HeaderCell, Cell } = Table;
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

interface CountUpAnimationProps {
  initialValue: number;
  targetValue: number;
}

export default function Home() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showCreateDepartmentModal, setShowCreateDepartmentModal] = useState<boolean>(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [active, setActive] = useState('Home');
  const [formData, setFormData] = useState<FormData>({
    organisation_name: '',
    departmentname: '',
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageTicket, setCurrentPageTicket] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit, setLimit] = React.useState(10);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    type: '',
    status: '',
    dueDate: '',
  });
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [departmentPage, setDepartmentPage] = useState<number>(1);
  const [departmentTotalPages, setDepartmentTotalPages] = useState<number>(1);
  const [departmentLimit, setDepartmentLimit] = useState<number>(5);
  const [totaldepartmentcount, settotaldepartmentcount] = useState<number>(0);
  const [totalusercount, settotalusercount] = useState<number>(0);
  const [totaltickets, settotaltickets] = useState<number>(0);


  useEffect(() => {
    const token = cookies.get('admintoken');
    if (!token) {
      navigate('/');
    } else {
      if (active === 'Organisations') {
        fetchDepartments(token, departmentPage, departmentLimit);
      }
      if (active === 'Tickets') {
        fetchTickets(token, currentPageTicket, limit, filterOptions)
          .then(data => {
            setTickets(data.tickets);
            setTotalPages(data.totalPages);
          })
          .catch(error => {
            console.error('Error fetching tickets:', error);
          });
      }
      if (active === 'Home') {
        organisationstats(token);
      }
    }
  }, [departmentPage, departmentLimit, currentPage, limit, filterOptions, currentPageTicket, active]);

  const fetchTickets = async (token: string, page: number, limit: number, filters: FilterOptions): Promise<{ tickets: Ticket[], totalPages: number, limit: string }> => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        type: filters.type || '',
        status: filters.status || '',
        dueDate: filters.dueDate || '',
      });

      const response = await fetch(`http://localhost:5000/admin/tickets/all?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          tickets: data.tickets,
          totalPages: data.totalPages,
          limit: limit.toString()
        };
      } else {
        throw new Error('Failed to fetch tickets');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error
    }
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilterOptions({ ...filterOptions, [e.target.name]: e.target.value });
  };
  const handlePaginationChange = (dataKey: React.SetStateAction<number>) => {
    setCurrentPageTicket(1);
    setLimit(dataKey);
  };
  const handlePaginationChangeOrganisation = (dataKey: React.SetStateAction<number>) => {
    setDepartmentPage(1);
    setDepartmentLimit(dataKey);
  };

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };
  const toggleCreateDepartmentModal = () => {
    setShowCreateDepartmentModal(!showCreateDepartmentModal);
  };

  const fetchDepartments = async (token: string, page: number, limit: number) => {
    try {
      const response = await fetch_Departments(token, page, limit);
      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        setDepartments(data.departments);
        setDepartmentTotalPages(data.totalPages);
        settotaldepartmentcount(data.totaldepartmentcount);
        settotalusercount(data.totalusercount);
        settotaltickets(data.totaltickets);

      } else {
        throw new Error('Failed to fetch departments');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };


  const organisationstats = async (token: string) => {
    try {
      const response = await organisation_stats(token);
      if (response.ok) {
        const data = await response.json();
        settotaldepartmentcount(data.totaldepartmentcount);
        settotalusercount(data.totalusercount);
        settotaltickets(data.totaltickets);

      } else {
        throw new Error('Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching stats', error);
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = cookies.get('admintoken');
      const response = await handle_Submit(token, formData)
      if (response.ok) {
        const responseData = await response.json();
        toast.success(responseData.message || 'Department created successfully');
        setFormData({
          organisation_name: '',
          departmentname: '',
        });
        setActive("Organisations")

        // setShowDepartmentDetailsModal(false);
        // setShowCreateDepartmentModal(!showCreateDepartmentModal);
        // fetchDepartments(token, departmentPage, departmentLimit);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
        console.error('Error creating department:', errorData.message);
      }
    } catch (error) {
      console.error('Error creating department:', error);
    }
  };
  const logout = () => {
    cookies.remove('admintoken', { path: '/' });
    navigate('/');
  };

  const handleDeleteDepartment = async (organisationName: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        const token = cookies.get('admintoken');
        const response = await handle_Delete_Department(organisationName, token)
        if (response.ok) {
          toast.success('Department deleted successfully');
          fetchDepartments(token, departmentPage, departmentLimit);
          // setShowDepartmentDetailsModal(false);
        } else {
          const errorData = await response.json();
          toast.error(errorData.message);
          console.error('Error deleting department:', errorData.message);
        }
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };
  const handleCreateUserClick = () => {
    navigate('./userregister');
  };

  const Navbar: React.FC<NavbarProps> = ({ active, onSelect, ...props }) => {
    return (
      <Nav {...props} activeKey={active} onSelect={onSelect} style={{ marginBottom: 50 }}>
        <Nav.Item eventKey="Home">Home</Nav.Item>
        <Nav.Item eventKey="Organisations">Organisations</Nav.Item>
        <Nav.Item eventKey="Tickets">Tickets</Nav.Item>
      </Nav>
    );
  };

  const handleEditDepartment = (index: number) => {
    const updatedDepartments = [...departments];
    updatedDepartments[index].editMode = true;
    setDepartments(updatedDepartments);
  };
  const handleSaveEditedDepartment = async (index: number) => {
    const editedDepartment = departments[index];
    try {
      const token = cookies.get('admintoken');
      const response = await handle_Save_Edited_Department(token, editedDepartment)
      if (response.ok) {
        toast.success('Department updated successfully');
        const updatedDepartments = [...departments];
        updatedDepartments[index].editMode = false;
        setDepartments(updatedDepartments);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
        console.error('Error updating department:', errorData.message);
      }
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  const ticketTypeClasses = {
    Story: 'text-blue-500',
    Bug: 'text-red-500',
    Task: 'text-yellow-500',
  };

  const CountUpAnimation: React.FC<CountUpAnimationProps> = ({
    initialValue,
    targetValue,
  }) => {
    const [count, setCount] = useState(initialValue);
    const duration = 1000; // 1 seconds

    useEffect(() => {
      let startValue = initialValue;
      const interval = Math.floor(
        duration / (targetValue - initialValue));

      const counter = setInterval(() => {
        startValue += 1;
        setCount(startValue);
        if (startValue >= targetValue) {
          clearInterval(counter);
        }
      }, interval);

      return () => {
        clearInterval(counter);
      };
    }, [targetValue, initialValue]);

    return (
      <div className="container">
        <span className="num">{count}</span>
      </div>
    );
  };

  return (
    <>
      <div className={cx('bg-indigo-700', 'text-white', 'text-center', 'p-3')}>
        <p className={cx("text-3xl", "font-extrabold")}>Welcome to Home Page</p>
        <Button
          onClick={logout}

          className={cx("exit-button", "text-white", "bg-transparent", "hover:bg-transparent", "transition-all", "text-indigo-700", "hover:text-white", "font-semibold", "text-lg", "px-2", "py-1", "rounded", "duration-700", "absolute", "top-4", "right-4")}><ExitIcon /></Button>
      </div>
      <div className={cx("w-full", "h-screen", "bg-gray-100")}>
        <Navbar className={cx("m-1")} appearance="tabs" active={active} onSelect={setActive} />
        <div className={cx("fixed", "bottom-10", "right-11")}>
        </div>
        {active === "Organisations" && (
          <>
            <p className={cx("text-4xl", "font-extrabold", "text-center")}>Departments</p>
            <br></br>
            <div className={cx("w-full", "justify-center", "items-center")}>
              <div className={cx("mx-auto")} style={{ maxWidth: "800px" }}>
                <Table
                  height={400}
                  data={departments}
                >
                  <Column width={200} align="center" fixed>
                    <HeaderCell>Organization Name</HeaderCell>
                    <Cell dataKey="organisation_name" />
                  </Column>
                  <Column width={200} align="center" fixed>
                    <HeaderCell>Department Name</HeaderCell>
                    <Cell dataKey="name">
                      {(rowData, rowIndex?: number) => {
                        if (rowData.editMode) {
                          return (
                            <Input
                              type="text"
                              value={rowData.name}
                              onChange={(value) => {
                                if (rowIndex !== undefined) {
                                  const updatedDepartments = [...departments];
                                  updatedDepartments[rowIndex].name = value;
                                  setDepartments(updatedDepartments);
                                }
                              }}
                            />
                          );
                        } else {
                          return <span>{rowData.name}</span>;
                        }
                      }}
                    </Cell>
                  </Column>
                  <Column width={200} align="center" fixed>
                    <HeaderCell>User Count</HeaderCell>
                    <Cell dataKey="userCount" />
                  </Column>
                  <Column width={200} align="center" fixed>
                    <HeaderCell>Actions</HeaderCell>
                    <Cell>
                      {(rowData, index?: number) => (
                        <span>
                          <Button
                            color="blue"
                            appearance="ghost"
                            size="xs"
                            onClick={() => navigate(`/department/${rowData.organisation_name}`)}
                          >
                            <FaEye />
                          </Button>
                          {' '}

                          {!rowData.editMode ? (
                            <Button
                              color="orange"
                              appearance="ghost"
                              size="xs"
                              onClick={() => index !== undefined && handleEditDepartment(index)}
                            >
                              <EditIcon />
                            </Button>
                          ) : (
                            <Button
                              color="blue"
                              appearance="ghost"
                              size="xs"
                              onClick={() => index !== undefined && handleSaveEditedDepartment(index)}
                            >
                              Save
                            </Button>
                          )}
                          {' '}
                          <Button
                            color="red"
                            appearance="ghost"
                            size="xs"
                            onClick={() => handleDeleteDepartment(rowData.organisation_name)}
                          >
                            <TrashIcon />
                          </Button>
                        </span>
                      )}
                    </Cell>
                  </Column>
                </Table>
                <Pagination
                  prev
                  next
                  first
                  last
                  ellipsis
                  boundaryLinks
                  maxButtons={5}
                  size="md"
                  layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                  total={departmentTotalPages * departmentLimit}
                  limitOptions={[5, 10, 20]}
                  limit={departmentLimit}
                  activePage={departmentPage}
                  onChangePage={setDepartmentPage}
                  onChangeLimit={handlePaginationChangeOrganisation}
                />
              </div>
            </div>
            <div className={cx("fixed", "bottom-4", "right-4", "flex", "flex-col", "space-y-2")}>
              <Button onClick={handleCreateUserClick} className="py-3 px-5 bg-indigo-700 text-white font-semibold rounded-full transition duration-300 transform hover:scale-105 hover:-translate-y-2">
                Create User
              </Button>
              <Button onClick={toggleCreateDepartmentModal} className="py-3 px-4 bg-indigo-700 text-white font-semibold rounded-full transition duration-300 transform hover:scale-105 hover:-translate-y-2">
                Department
              </Button>
            </div>
          </>
        )}
        {active === "Tickets" && (
          <>
            <p className={cx("text-3xl", "font-extrabold", "text-center")}>Tickets</p>
            <FiFilter className={cx("absolute", "top-20", "right-5", "text-4xl", "text-white", "cursor-pointer", "bg-indigo-600", "font-semibold", "px-1", "py-1", "rounded-full")} onClick={toggleFilterModal} />
            <div className={cx("m-3")}>
              <Table
                height={450}
                data={tickets}
                virtualized={true}
                wordWrap={false}
                style={{ margin: '10px' }}
              >

                <Column width={100} align="center">
                  <HeaderCell>Serial Number</HeaderCell>
                  <Cell>
                    {(_rowData, index) => (
                      <span>{(currentPage - 1) * limit + (index !== undefined ? index + 1 : 0)}</span>
                    )}
                  </Cell>
                </Column>

                <Column flexGrow={1} align="center">
                  <HeaderCell>Ticket Key</HeaderCell>
                  <Cell dataKey="key" />
                </Column>
                <Column flexGrow={1} align="center">
                  <HeaderCell>Type</HeaderCell>
                  <Cell dataKey="type">
                    {rowData => (
                      <span className={classNames('flex items-center', ticketTypeClasses[rowData.type])}>
                        {rowData.type === 'Story' && <FaBook className="mr-1" />}
                        {rowData.type === 'Bug' && <FaBug className="mr-1" />}
                        {rowData.type === 'Task' && <FaTasks className="mr-1" />}
                        {rowData.type}
                      </span>
                    )}
                  </Cell>
                </Column>
                <Column flexGrow={1} align="center">
                  <HeaderCell>Reporter</HeaderCell>
                  <Cell dataKey="reporter" />
                </Column>
                <Column flexGrow={1} align="center">
                  <HeaderCell>Assignee</HeaderCell>
                  <Cell dataKey="assignee" />
                </Column>
                <Column flexGrow={1} align="center">
                  <HeaderCell>Summary</HeaderCell>
                  <Cell dataKey="summary" />
                </Column>
                <Column flexGrow={1} align="center">
                  <HeaderCell>Due Date</HeaderCell>
                  <Cell>{rowData => formatDate(rowData.dueDate)}</Cell>
                </Column>
                <Column flexGrow={1} align="center">
                  <HeaderCell>Status</HeaderCell>
                  <Cell>
                    {rowData => (
                      <span className={`${rowData.status === 'TOBEPICKED' ? 'text-red-500' : rowData.status === 'INPROGRESS' ? 'text-yellow-500' : rowData.status === 'INTESTING' ? 'text-blue-500' : 'text-green-500'}`}>
                        {rowData.status && rowData.status === 'TOBEPICKED' ? 'To be picked' : rowData.status === 'INPROGRESS' ? 'In Progress' : rowData.status === 'INTESTING' ? 'In Testing' : 'Completed'}
                      </span>
                    )}
                  </Cell>
                </Column>
              </Table>
              <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                maxButtons={5}
                size="md"
                layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                total={totalPages * limit}
                limitOptions={[5, 10, 20]}
                limit={limit}
                activePage={currentPageTicket}
                onChangePage={setCurrentPageTicket}
                onChangeLimit={handlePaginationChange}
              />
            </div>
            <div className={cx("fixed", "bottom-4", "right-4", "flex", "flex-col", "space-y-2")}>
              <Button onClick={handleCreateUserClick} className="py-3 px-5 bg-indigo-700 text-white font-semibold rounded-full transition duration-300 transform hover:scale-105 hover:-translate-y-2">
                Create User
              </Button>
              <Button onClick={toggleCreateDepartmentModal} className="py-3 px-4 bg-indigo-700 text-white font-semibold rounded-full transition duration-300 transform hover:scale-105 hover:-translate-y-2">
                Department
              </Button>
            </div>
          </>
        )}
        <Modal overflow={true} open={showCreateDepartmentModal} onClose={() => setShowCreateDepartmentModal(!showCreateDepartmentModal)}>
          <Modal.Header>
            <Modal.Title>Create Department</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className={cx("py-1", "block", "text-sm", "font-medium", "text-gray-700")}>
                  Organisation Name
                </label>
                <Input
                  placeholder="Organisation Name"
                  type="text"
                  className={cx("w-full", "border", "rounded", "px-4", "py-2", "border-gray-300")}
                  name="organisation_name"
                  id="organisation_name"
                  value={formData.organisation_name}
                  onChange={(value) => setFormData({ ...formData, organisation_name: value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className={cx("py-1", "block", "text-sm", "font-medium", "text-gray-700")}>
                  Department Name
                </label>
                <Input
                  placeholder="Department Name"
                  type="text"
                  className={cx("w-full", "border", "rounded", "px-4", "py-2", "border-gray-300")}
                  name="departmentname"
                  id="departmentname"
                  value={formData.departmentname}
                  onChange={(value) => setFormData({ ...formData, departmentname: value })}
                  required
                />
              </div>
              <Modal.Footer>
                <Button type="submit" onClick={() => setShowCreateDepartmentModal(false) } appearance="primary">
                  Submit
                </Button>
                <Button onClick={toggleCreateDepartmentModal} appearance="subtle">
                  Cancel
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>
        <Modal overflow={true} open={showFilterModal} onClose={() => setShowFilterModal(!showFilterModal)}>
          <Modal.Header>
            <Modal.Title>Tickets Filter</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="mb-4">
                <label htmlFor="type" className={cx("block", "text-sm", "font-medium", "text-gray-700")}>
                  Type
                </label>
                <select name="type" id="type" value={filterOptions.type} onChange={handleFilterChange} className={cx("border-gray-300", " rounded-md w-full")}>
                  <option value="">All Types</option>
                  <option value="Story">Story</option>
                  <option value="Task">Task</option>
                  <option value="Bug">Bug</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="status" className={cx("block", "text-sm", "font-medium", "text-gray-700")}>
                  Status
                </label>
                <select name="status" id="status" value={filterOptions.status} onChange={handleFilterChange} className={cx("border-gray-300", " rounded-md w-full")}>
                  <option value="">All Status</option>
                  <option value="TOBEPICKED">To Be Picked</option>
                  <option value="INPROGRESS">In Progress</option>
                  <option value="INTESTING">In Testing</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="dueDate" className={cx("block", "text-sm", "font-medium", "text-gray-700")}>
                  Due Date
                </label>
                <input type="date" min={new Date().toISOString().split('T')[0]}
                  name="dueDate" id="dueDate" value={filterOptions.dueDate} onChange={handleFilterChange} className={cx("border-gray-300", " rounded-md w-full")} />
              </div>
              <div className="flex justify-end">
                <Button type="button" onClick={toggleFilterModal} className={cx("bg-indigo-700", "text-white", "font-semibold", "px-4", "py-2", "rounded-md", "mr-2")}>
                  Apply
                </Button>
                <Button type="button" onClick={() => { setFilterOptions({ type: '', status: '', dueDate: '' }) }} className={cx("bg-gray-300", "text-gray-700", "font-semibold", "px-4 ", "py-2", "rounded-md")}>
                  Clear
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal >
        {active === "Home" && (
          <div className={cx("flex", "flex-row", "flex-wrap")}>
            <div className={cx("flex", "flex-grow", "justify-center", "items-center")}>
              <div className={cx("m-4", "bg-white", "rounded-lg", "shadow-lg", "p-6", "text-center w-96")}>
                <h2 className={cx("text-3xl", "font-bold", "text-indigo-900", "mb-4")}>Total Organisations</h2>
                <div className={cx("text-9xl", "font-semibold", "text-center", "mt-4")}>
                 {totaldepartmentcount} 
                </div>
              </div>
            </div>
            <div className={cx("flex", "flex-grow", "justify-center", "items-center")}>
              <div className={cx("m-4", "bg-white", "rounded-lg", "shadow-lg", "p-6", "text-center w-96")}>
                <h2 className={cx("text-3xl", "font-bold", "text-indigo-900", "mb-4")}>Total Users</h2>
                <div className={cx("text-9xl", "font-semibold", "text-center", "mt-4")}>
                 {totalusercount}
                </div>
              </div>
            </div>
            <div className={cx("flex", "flex-grow", "justify-center", "items-center")}>
              <div className={cx("m-4", "bg-white", "rounded-lg", "shadow-lg", "p-6", "text-center w-96")}>
                <h2 className={cx("text-3xl", "font-bold", "text-indigo-900", "mb-4")}>Total Tickets</h2>
                <div className={cx("text-9xl", "font-semibold", "text-center", "mt-4")}>
                  {totaltickets}
                </div>
              </div>
            </div>
            <div className={cx("fixed", "bottom-4", "right-4", "flex", "flex-col", "space-y-2")}>
              <Button onClick={handleCreateUserClick} className="py-3 px-5 bg-indigo-700 text-white font-semibold rounded-full transition duration-300 transform hover:scale-105 hover:-translate-y-2">
                Create User
              </Button>
              <Button onClick={toggleCreateDepartmentModal} className="py-3 px-4 bg-indigo-700 text-white font-semibold rounded-full transition duration-300 transform hover:scale-105 hover:-translate-y-2">
                Department
              </Button>
            </div>
          </div>

        )};
      </div>
      < ToastContainer />
    </>
  );
}