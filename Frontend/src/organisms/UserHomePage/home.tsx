import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Cookies } from "react-cookie";
import "react-toastify/dist/ReactToastify.css";
import TicketDetailsModal from "../../organisms/TicketDetailsModal/TicketDetailsModal";
import { FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styles from "./UserHome.module.scss";
import {
	Avatar,
	Button,
	Dropdown,
	Modal,
	Table,
	Pagination,
	Nav,
	Input,
	NavbarProps,
	SelectPicker,
} from "rsuite";
import {
	fetchTicketsData,
	createTicket,
	SaveTicketChanges,
	fetchReportedTicketsData,
	geticketcount,
} from "../../services/UserHome";
import {
	Ticket,
	FormData,
	FilterOptions,
	userdata,
} from "../../typings/UserHome";
import { FaEye } from "react-icons/fa";
import { FaBug, FaTasks, FaBook } from "react-icons/fa";
const { Column, HeaderCell, Cell } = Table;
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function Home() {
	const navigate = useNavigate();
	const cookies = new Cookies();
	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [showTicketDetailsModal, setShowTicketDetailsModal] =
		useState<boolean>(false);
	const [showCreateTicketModal, setShowCreateTicketModal] =
		useState<boolean>(false);
	const [selectedTicket, setSelectedTicket] = useState<Ticket>();
	const [userdata, setUserdata] = useState<userdata>();
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [otp, setOTP] = useState("");
	const [showOTPInput, setShowOTPInput] = useState(false);
	const [password, setPassword] = useState("");
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [currentPageReported, setCurrentPageReported] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [limit, setLimit] = React.useState(10);
	const [active, setActive] = React.useState("home");
	const [ReportedTickets, setReportedTickets] = useState<Ticket[]>([]);
	const [ReportedTotalPages, setReportedTotalPages] = useState<number>(1);
	const [AssignedTicketscount, setassignedticketscount] = useState<number>(0);
	const [ReportedTicketscount, setreportedticketscount] = useState<number>(0);

	const [userinputdata, setuserinputdata] = useState({
		email: "",
		firstname: "",
		lastname: "",
	});

	useEffect(() => {
		// Set default values for user input data from userdata
		setuserinputdata({
			email: userdata?.email,
			firstname: userdata?.firstname,
			lastname: userdata?.lastname,
		});
	}, [userdata]);

	const [formData, setFormData] = useState<FormData>({
		type: "",
		summary: "",
		description: "",
		assignee: "",
		dueDate: "",
		files: null,
	});
	const [filterOptions, setFilterOptions] = useState<FilterOptions>({
		type: "",
		status: "",
		dueDate: "",
	});
	const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
	const [showUserModal, setShowUserModal] = useState(false);
	const [assignes, setAssignes] = useState([])

	useEffect(() => {
		const token = cookies.get("token");
		if (!token) {
			navigate("/");
		} fetchUserDetails(token);
	}, [])
	useEffect(() => {
		const token = cookies.get("token");
		if (!token) {
			navigate("/");
		} else {
			if (active === 'AssignedTickets') {
				fetchTickets(token, currentPage, limit, filterOptions)
					.then((data) => {
						// setTotalAssignedTickets(data.tickets.length);
						setTickets(data.tickets);
						setTotalPages(data.totalPages);

					})
					.catch((error) => {
						console.error("Error fetching tickets:", error);
					});
			}
			if (active === 'ReportedTickets') {
				fetchReportedTickets(token, currentPageReported, limit, filterOptions)
					.then((data) => {
						setReportedTickets(data.tickets);
						setReportedTotalPages(data.totalPages);
					})
					.catch((error) => {
						console.error("Error fetching tickets:", error);
					});
			}
			if (active === 'home') {
				// fetchUserDetails(token);
				fetchTicketsCount(token)
					.then((data) => {
						setassignedticketscount(data.totalAssignedTickets);
						setreportedticketscount(data.totalReportedTickets);
						if (data.assigne) {
							setAssignes(data.assigne)
						}
					})
			}
		}
	}, [currentPage, limit, filterOptions, currentPageReported, active]);

	const fetchTickets = async (
		token: string,
		page: number,
		limit: number,
		filters: FilterOptions
	): Promise<{
		tickets: Ticket[];
		totalPages: number;
		limit: string;
		totalAssignedTickets: number;
	}> => {
		try {
			const queryParams = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				type: filters.type || "",
				status: filters.status || "",
				dueDate: filters.dueDate || "",
			});

			const data = await fetchTicketsData(token, queryParams);
			return {
				tickets: data.tickets,
				totalPages: data.totalPages,
				limit: limit.toString(),
				totalAssignedTickets: data.AssignedTicketCount,
			};
		} catch (error) {
			console.error("Error fetching tickets:", error);
			toast.error("Failed To Fetch Tickets");
			throw error;
		}
	};

	const fetchTicketsCount = async (
		token: string,
	): Promise<{
		totalReportedTickets: number;
		totalAssignedTickets: number;
		assigne: any
	}> => {
		try {
			const data = await geticketcount(token);
			return {
				totalReportedTickets: data.ReportedTicketCount,
				totalAssignedTickets: data.AssignedTicketCount,
				assigne: data.TotalAssigne,
			};
		} catch (error) {
			console.error("Error fetching tickets count:", error);
			toast.error("Failed To Fetch Tickets");
			throw error;
		}
	};

	const fetchReportedTickets = async (
		token: string,
		page: number,
		limit: number,
		filters: FilterOptions
	): Promise<{
		tickets: Ticket[];
		totalPages: number;
		limit: string;
		totalReportedTickets: number;
	}> => {
		try {
			const queryParams = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				type: filters.type || "",
				status: filters.status || "",
				dueDate: filters.dueDate || "",
			});

			const data = await fetchReportedTicketsData(token, queryParams);
			return {
				tickets: data.tickets,
				totalPages: data.totalPages,
				limit: limit.toString(),
				totalReportedTickets: data.ReportedTicketCount,
			};
		} catch (error) {
			console.error("Error fetching tickets:", error);
			toast.error("Failed To Fetch Tickets");
			throw error;
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const token = cookies.get("token");
		try {
			const message = await createTicket(formData);
			toast.success(message || "Ticket created successfully");
			setShowCreateTicketModal(false);
			setActive("ReportedTickets")
			// fetchTickets(token, currentPage, limit, filterOptions)
			// 	.then(data => {
			// 		setTickets(data.tickets);
			// 		setTotalPages(data.totalPages);
			// 		setassignedticketscount(data.totalAssignedTickets);
			// 	});
			// fetchReportedTickets(token, currentPage, limit, filterOptions)
			// 	.then((data) => {
			// 		setReportedTickets(data.tickets);
			// 		setReportedTotalPages(data.totalPages);
			// 		setreportedticketscount(data.totalReportedTickets);
			// 	})
			setFormData({
				type: "",
				summary: "",
				description: "",
				assignee: "",
				dueDate: "",
				files: null,
			});
		} catch (error: any) {
			toast.error(error.message);
			console.error("Error creating ticket:", error.message);
		}
	};

	const handleSaveTicketChanges = async (updatedTicket: Ticket) => {
		const token = cookies.get("token");
		try {
			const message = await SaveTicketChanges(updatedTicket);
			toast.success(message);
			if (active == 'AssignedTickets') {
				fetchTickets(token, currentPage, limit, filterOptions)
					.then(data => {
						setTickets(data.tickets);
						setTotalPages(data.totalPages);
						setassignedticketscount(data.totalAssignedTickets);
					});
			}
			if (active == 'ReportedTickets') {
				fetchReportedTickets(token, currentPage, limit, filterOptions)
					.then((data) => {
						setReportedTickets(data.tickets);
						setReportedTotalPages(data.totalPages);
						setreportedticketscount(data.totalReportedTickets);
					})
			}
			setShowTicketDetailsModal(false);

		} catch (error: any) {
			toast.error(error.message);
			console.error("Error updating ticket details:", error.message);
		}
	};

	const logout = () => {
		cookies.remove("token");
		navigate("/userlogin");
	};

	const toggleTicketDetailsModal = (ticket: Ticket) => {
		setSelectedTicket(ticket);
		setShowTicketDetailsModal(!showTicketDetailsModal);
	};

	const toggleCreateTicketModal = () => {
		setShowCreateTicketModal(!showCreateTicketModal);
	};

	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
		const month =
			date.getMonth() + 1 < 10
				? "0" + (date.getMonth() + 1)
				: date.getMonth() + 1;
		const year = date.getFullYear();
		return `${day}-${month}-${year}`;
	};

	const handleCloseTicketDetailsModal = () => {
		setShowTicketDetailsModal(false);
	};

	const handleFilterChange = (
		e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
	) => {
		setFilterOptions({ ...filterOptions, [e.target.name]: e.target.value });
	};

	const toggleFilterModal = () => {
		setShowFilterModal(!showFilterModal);
	};

	const fetchUserDetails = async (token: any) => {
		try {
			const response = await fetch(
				"http://localhost:5000/user/getuserdetails",
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (response.ok) {
				const data = await response.json();

				setUserdata(data.data);
			}
		} catch (error) {
			console.error("Error fetching users:", error);
		}
		setShowUserModal(!showUserModal);
	};

	const Navbar: React.FC<NavbarProps> = ({ active, onSelect, ...props }) => {
		return (
			<Nav
				{...props}
				activeKey={active}
				onSelect={onSelect}
				style={{ marginBottom: 50 }}
			>
				<Nav.Item eventKey="home">Home</Nav.Item>
				<Nav.Item eventKey="AssignedTickets">Assigned Tickets</Nav.Item>
				<Nav.Item eventKey="ReportedTickets">Reported Tickets</Nav.Item>
			</Nav>
		);
	};

	const renderToggle = (props) => (
		<Avatar circle {...props} style={{ color: "blue", fontWeight: "bold" }}>
			{userdata?.firstname[0].toUpperCase()}
		</Avatar>
	);

	const handleSendOTP = async () => {
		try {
			const response = await fetch("http://localhost:5000/user/resendotp", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email: userdata?.email }),
			});
			if (response.ok) {
				toast.success("OTP has been resent successfully.");
				setShowOTPInput(true);
			} else {
				toast.error("Failed to resend OTP.");
			}
		} catch (error) {
			console.error("Error resending OTP:", error);
			toast.error("Failed to resend OTP.");
		}
	};

	const handleVerify = async () => {
		const token = cookies.get("token");

		try {
			const response = await fetch("http://localhost:5000/user/commitchange", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: userdata.email,
					newFirstName: userinputdata.firstname,
					newLastName: userinputdata.lastname,
					newPassword: password,
					otp: otp,
				}),
			});
			// console.log(response);

			if (response.ok) {
				toast.success("Changes committed successfully.");
				setShowUserModal(false);
				// console.log(response);
				fetchUserDetails(token);
				setOpen(!open);
				// fetchUserDetails(TO)
			} else {
				toast.error("Failed to commit changes.");
			}
		} catch (error) {
			console.error("Error committing changes:", error);
			toast.error("Failed to commit changes.");
		}
	};

	const handlePaginationChange = (dataKey: React.SetStateAction<number>) => {
		setCurrentPage(1);
		setLimit(dataKey);
	};

	const handlePaginationChangeinReporter = (
		dataKey: React.SetStateAction<number>
	) => {
		setCurrentPageReported(1);
		setLimit(dataKey);
	};

	const ticketTypeClasses = {
		Story: "text-blue-500",
		Bug: "text-red-500",
		Task: "text-yellow-500",
	};

	const CountUpAnimation = ({
		iconComponent,
		initialValue,
		targetValue,
		text,
	}) => {
		const [count, setCount] = useState(initialValue);
		const duration = 1000; // 4 seconds

		useEffect(() => {
			let startValue = initialValue;
			const interval = Math.floor(duration / (targetValue - initialValue));

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
				<div className="icon">{iconComponent}</div>
				<span className="num">{count}</span>
				<span className="text">{text}</span>
			</div>
		);
	};

	return (
		<>
			<div className={cx("h-screen", "bg-gray-100", "pb-6")}>
				<div className={cx("bg-indigo-700", "text-white", "text-center", "p-4")}>
					<p className={cx("text-4xl font-extrabold")}>
						Welcome {userdata?.firstname} {userdata?.lastname}
					</p>
					<div className={cx("absolute", "top-4", "right-4")}>
						<Dropdown renderToggle={renderToggle} placement="bottomEnd">
							<Dropdown.Item
								panel
								style={{ color: "black", padding: 10, width: 160 }}
							>
								<p>Signed in as</p>
								<strong>{userdata?.firstname}</strong>
							</Dropdown.Item>
							<Dropdown.Separator />
							<Dropdown.Item onClick={handleOpen}>Your profile</Dropdown.Item>
							<Dropdown.Separator />
							<Dropdown.Item onClick={logout}>Sign out</Dropdown.Item>
						</Dropdown>
					</div>
					{/* <button onClick={logout} className='bg-white border-2 border-white hover:bg-transparent transition-all text-indigo-700 hover:text-white font-semibold text-lg px-4 py-2 rounded duration-700 absolute top-4 right-4'>Logout</button> */}
				</div>
				<Navbar
					className="bg-white m-1"
					appearance="tabs"
					active={active}
					onSelect={setActive}
				/>

				{/* <FiFilter className={cx("absolute", "top-20", "right-5", "text-4xl", "text-white", "cursor-pointer", "bg-indigo-600", "font-semibold", "px-1", "py-1", "rounded-full")} onClick={toggleFilterModal} /> */}
				{/* <Navbar appearance="tabs" active={active} onSelect={setActive} /> */}
				{active === "AssignedTickets" && (
					<>
						<p className={cx("text-4xl", "font-extrabold", "text-center")}>
							Tickets
						</p>
						<FiFilter
							className={cx(
								"absolute",
								"top-20",
								"right-5",
								"text-4xl",
								"text-white",
								"cursor-pointer",
								"bg-indigo-600",
								"font-semibold",
								"px-1",
								"py-1",
								"rounded-full"
							)}
							onClick={toggleFilterModal}
						/>
						<div className={cx("m-5", "mb-10")}>
							<Table
								height={450}
								data={tickets}
								onRowClick={(rowData) => toggleTicketDetailsModal(rowData)}
								virtualized={true}
								wordWrap={false}
								style={{ margin: "10px" }}
							>
								<Column width={100} align="center">
									<HeaderCell>Serial Number</HeaderCell>
									<Cell>
										{(_rowData, index) => (
											<span>{(currentPage - 1) * limit + index + 1}</span>
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
										{(rowData) => (
											<span
												className={classNames(
													"flex items-center",
													ticketTypeClasses[rowData.type]
												)}
											>
												{rowData.type === "Story" && (
													<FaBook className="mr-1" />
												)}
												{rowData.type === "Bug" && <FaBug className="mr-1" />}
												{rowData.type === "Task" && (
													<FaTasks className="mr-1" />
												)}
												{rowData.type}
											</span>
										)}
									</Cell>
								</Column>
								<Column flexGrow={1.2} align="center">
									<HeaderCell>Reporter</HeaderCell>
									<Cell dataKey="reporter" />
								</Column>
								<Column flexGrow={1} align="start">
									<HeaderCell>Summary</HeaderCell>
									<Cell dataKey="summary" />
								</Column>
								<Column flexGrow={1} align="center">
									<HeaderCell>Due Date</HeaderCell>
									<Cell>{(rowData) => formatDate(rowData.dueDate)}</Cell>
								</Column>
								<Column flexGrow={1} align="center">
									<HeaderCell>Status</HeaderCell>
									<Cell>
										{(rowData) => (
											<span
												className={`${rowData.status === "TOBEPICKED"
													? "text-red-500"
													: rowData.status === "INPROGRESS"
														? "text-yellow-500"
														: rowData.status === "INTESTING"
															? "text-blue-500"
															: "text-green-500"
													}`}
											>
												{rowData.status && rowData.status === "TOBEPICKED"
													? "To be picked"
													: rowData.status === "INPROGRESS"
														? "In Progress"
														: rowData.status === "INTESTING"
															? "In Testing"
															: "Completed"}
											</span>
										)}
									</Cell>
								</Column>
								<Column width={100} align="center" fixed>
									<HeaderCell>Actions</HeaderCell>
									<Cell>
										{(rowData, index?: number) => (
											<span>
												<Button
													color="blue"
													appearance="ghost"
													size="xs"
													onClick={() => toggleTicketDetailsModal(rowData)}
												>
													<FaEye />
												</Button>{" "}
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
								layout={["total", "-", "limit", "|", "pager", "skip"]}
								total={totalPages * limit}
								limitOptions={[10, 20]}
								limit={limit}
								activePage={currentPage}
								onChangePage={setCurrentPage}
								onChangeLimit={handlePaginationChange}
							/>
						</div>
					</>
				)}

				{active === "ReportedTickets" && (
					<>
						<p className={cx("text-4xl", "font-extrabold", "text-center")}>
							Reported Tickets
						</p>
						<FiFilter
							className={cx(
								"absolute",
								"top-20",
								"right-5",
								"text-4xl",
								"text-white",
								"cursor-pointer",
								"bg-indigo-600",
								"font-semibold",
								"px-1",
								"py-1",
								"rounded-full"
							)}
							onClick={toggleFilterModal}
						/>
						<div className={cx("m-5", "mb-100")}>
							<Table
								height={450}
								data={ReportedTickets}
								onRowClick={(rowData) => toggleTicketDetailsModal(rowData)}
								virtualized={true}
								wordWrap={false}
								style={{ margin: "10px" }}
							>
								<Column width={100} align="center">
									<HeaderCell>Serial Number</HeaderCell>
									<Cell>
										{(_rowData, index) => (
											<span>{(currentPage - 1) * limit + index + 1}</span>
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
										{(rowData) => (
											<span
												className={classNames("flex items-center", ticketTypeClasses[rowData.type])}>
												{rowData.type === "Story" && (
													<FaBook className="mr-1" />
												)}
												{rowData.type === "Bug" && <FaBug className="mr-1" />}
												{rowData.type === "Task" && (
													<FaTasks className="mr-1" />
												)}
												{rowData.type}
											</span>
										)}
									</Cell>
								</Column>
								<Column flexGrow={1} align="center">
									<HeaderCell>Assignee</HeaderCell>
									<Cell dataKey="assignee" />
								</Column>
								<Column flexGrow={1} align="start">
									<HeaderCell>Summary</HeaderCell>
									<Cell dataKey="summary" />
								</Column>
								<Column flexGrow={1} align="center">
									<HeaderCell>Due Date</HeaderCell>
									<Cell>{(rowData) => formatDate(rowData.dueDate)}</Cell>
								</Column>
								<Column flexGrow={1} align="center">
									<HeaderCell>Status</HeaderCell>
									<Cell>
										{(rowData) => (
											<span
												className={`${rowData.status === "TOBEPICKED"
													? "text-red-500"
													: rowData.status === "INPROGRESS"
														? "text-yellow-500"
														: rowData.status === "INTESTING"
															? "text-blue-500"
															: "text-green-500"
													}`}
											>
												{rowData.status && rowData.status === "TOBEPICKED"
													? "To be picked"
													: rowData.status === "INPROGRESS"
														? "In Progress"
														: rowData.status === "INTESTING"
															? "In Testing"
															: "Completed"}
											</span>
										)}
									</Cell>
								</Column>
								<Column width={100} align="center" fixed>
									<HeaderCell>Actions</HeaderCell>
									<Cell>
										{(rowData, index?: number) => (
											<span>
												<Button
													color="blue"
													appearance="ghost"
													size="xs"
													onClick={() => toggleTicketDetailsModal(rowData)}
												>
													<FaEye />
												</Button>{" "}
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
								layout={["total", "-", "limit", "|", "pager", "skip"]}
								total={ReportedTotalPages * limit}
								limitOptions={[10, 20]}
								limit={limit}
								activePage={currentPageReported}
								onChangePage={setCurrentPageReported}
								onChangeLimit={handlePaginationChangeinReporter}
							/>
						</div>
						<button
							onClick={toggleCreateTicketModal}
							className={cx(
								"bg-indigo-700",
								"text-white",
								"font-semibold",
								"px-5",
								"py-3",
								"rounded-full",
								"fixed",
								"bottom-8",
								"right-8"
							)}
						>
							Create Ticket
						</button>
					</>
				)}

				{active === "home" && (
					<div className={cx("flex", "flex-row", "flex-wrap")}>
						<button
							onClick={toggleCreateTicketModal}
							className={cx(
								"bg-indigo-700",
								"text-white",
								"font-semibold",
								"px-5",
								"py-3",
								"rounded-full",
								"fixed",
								"bottom-8",
								"right-8"
							)}
						>
							Create Ticket
						</button>
						<div
							className={cx(
								"flex",
								"flex-grow",
								"justify-center",
								"items-center"
							)}
						>
							<div
								className={cx(
									"m-4",
									"bg-white",
									"rounded-lg",
									"shadow-lg",
									"p-6",
									"text-center",
									"w-96"
								)}
							>
								<h2
									className={cx(
										"text-3xl",
										"font-bold",
										"text-indigo-900",
										"mb-4"
									)}
								>
									Total Assigned Tickets
								</h2>
								<div
									className={cx(
										"text-9xl",
										"font-semibold",
										"text-center",
										"mt-4"
									)}
								>
									{AssignedTicketscount}
								</div>
							</div>
						</div>
						<div className="flex flex-grow justify-center items-center">
							<div
								className={cx(
									"m-4",
									"bg-white",
									"rounded-lg",
									"shadow-lg",
									"p-6",
									"text-center",
									"w-96"
								)}
							>
								<h2
									className={cx(
										"text-3xl",
										"font-bold",
										"text-indigo-900",
										"mb-4"
									)}
								>
									Total Reported Tickets
								</h2>
								<div
									className={cx(
										"text-9xl",
										"font-semibold",
										"text-center",
										"mt-4"
									)}
								>
									{ReportedTicketscount}
								</div>
							</div>
						</div>
					</div>
				)}

				<Modal
					overflow={true}
					open={showTicketDetailsModal}
					onClose={handleCloseTicketDetailsModal}
				>
					<Modal.Header>
						<Modal.Title
							style={{
								fontWeight: "bold",
								fontSize: "20px",
								textAlign: "center",
							}}
						>
							Ticket Details
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<TicketDetailsModal
							ticket={selectedTicket}
							onSave={handleSaveTicketChanges}
							onClose={handleCloseTicketDetailsModal}
						/>
					</Modal.Body>
				</Modal>

				<Modal
					overflow={true}
					open={showCreateTicketModal}
					onClose={toggleCreateTicketModal}
				>
					<Modal.Header>
						<Modal.Title
							style={{
								fontWeight: "bold",
								fontSize: "20px",
								textAlign: "center",
							}}
						>
							Create Ticket
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<label
									htmlFor="type"
									className={cx(
										"py-1",
										"block",
										"text-sm",
										"font-medium",
										"text-gray-700"
									)}
								>
									Type
								</label>
								<select
									name="type"
									id="type"
									value={formData.type}
									onChange={handleInputChange}
									className={cx("w-full", "border", "rounded", "px-4", "py-2")}
									required
								>
									<option value="">Select Type</option>
									<option value="Story">Story</option>
									<option value="Task">Task</option>
									<option value="Bug">Bug</option>
								</select>
							</div>
							<div className="mb-4">
								<label
									htmlFor="summary"
									className=" py-1 block text-sm font-medium text-gray-700"
								>
									Summary
								</label>
								<Input
									type="text"
									name="summary"
									id="summary"
									placeholder="Summary"
									value={formData.summary}
									onChange={(value: string) =>
										setFormData({ ...formData, summary: value })
									}
									// onChange={handleInputChange}
									className={cx("w-full", "border", "rounded", "px-4", "py-2")}
									required
								/>
							</div>
							<div className="mb-4">
								<label
									htmlFor="description"
									className={cx(
										"py-1",
										"block text-sm",
										"font-medium",
										"text-gray-700"
									)}
								>
									Description
								</label>
								<textarea
									name="description"
									id="description"
									value={formData.description}
									onChange={handleInputChange}
									className={cx("w-full", "border", "rounded", "px-4", "py-2")}
									required
								/>
							</div>
							<div className="mb-4">
								<label
									htmlFor="assignee"
									className="py-1 block text-sm font-medium text-gray-700"
								>
									Assignee Email
								</label>
								{/* <Input
									type="email"
									name="assignee"
									id="assignee"
									value={formData.assignee}
									onChange={(value: string) =>
										setFormData({ ...formData, assignee: value })
									}
									// onChange={handleInputChange}
									className={cx("w-full", "border", "rounded", "px-4", "py-2")}
									required
								/> */}

								<SelectPicker
									data={assignes}
									labelKey="email"
									valueKey="email"
									className={cx("w-full", "border", "rounded")}
									onChange={(value: string) =>
										setFormData({ ...formData, assignee: value })
									}
								/>
							</div>
							<div className="mb-4">
								<label
									htmlFor="dueDate"
									className="py-1 block text-sm font-medium text-gray-700"
								>
									Due Date
								</label>
								<Input
									type="date"
									name="dueDate"
									min={new Date().toISOString().split('T')[0]}
									id="dueDate"
									value={formData.dueDate}
									onChange={(value) =>
										setFormData({ ...formData, dueDate: value })
									}
									// onChange={handleInputChange}
									className={cx("w-full", "border", "rounded", "px-4", "py-2")}
									required
								/>
							</div>
							<div className="mb-4">
								<label
									htmlFor="files"
									className="py-1 block text-sm font-medium text-gray-700"
								>
									Files
								</label>
								<Input
									type="file"
									name="files"
									id="files"
									onChange={(value) =>
										setFormData({ ...formData, files: value })
									}
									// onChange={handleFileChange}
									multiple
									className={cx("w-full", "border", "rounded", "px-4", "py-2")}
								/>
							</div>

							<Modal.Footer>
								<Button type="submit" appearance="primary">
									Submit
								</Button>
								<Button
									onClick={() => {
										setFormData({
											type: "",
											summary: "",
											description: "",
											assignee: "",
											dueDate: "",
											files: null,
										});
										toggleCreateTicketModal();
									}}
									appearance="subtle"
								>
									Cancel
								</Button>
							</Modal.Footer>
						</form>
					</Modal.Body>
				</Modal>
				<Modal
					overflow={true}
					open={showFilterModal}
					onClose={() => setShowFilterModal(!showFilterModal)}
				>
					<Modal.Header>
						<Modal.Title>Tickets Filter</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form>
							<div className="mb-4">
								<label
									htmlFor="type"
									className="block text-sm font-medium text-gray-700"
								>
									Type
								</label>
								<select
									name="type"
									id="type"
									value={filterOptions.type}
									onChange={handleFilterChange}
									className="border-gray-300 rounded-md w-full"
								>
									<option value="">All Types</option>
									<option value="Story">Story</option>
									<option value="Task">Task</option>
									<option value="Bug">Bug</option>
								</select>
							</div>
							<div className="mb-4">
								<label
									htmlFor="status"
									className="block text-sm font-medium text-gray-700"
								>
									Status
								</label>
								<select
									name="status"
									id="status"
									value={filterOptions.status}
									onChange={handleFilterChange}
									className="border-gray-300 rounded-md w-full"
								>
									<option value="">All Status</option>
									<option value="TOBEPICKED">To Be Picked</option>
									<option value="INPROGRESS">In Progress</option>
									<option value="INTESTING">In Testing</option>
									<option value="COMPLETED">Completed</option>
								</select>
							</div>
							<div className="mb-4">
								<label
									htmlFor="dueDate"
									className="block text-sm font-medium text-gray-700"
								>
									Due Date
								</label>
								<Input
									type="date"
									name="dueDate"
									id="dueDate"
									value={filterOptions.dueDate}
									onChange={(value) =>
										setFilterOptions({ ...filterOptions, dueDate: value })
									}
									// onChange={handleFilterChange}
									className="border-gray-300 rounded-md w-full"
								/>
							</div>
							<div className="flex justify-end">
								{/* <button
									type="button"
									onClick={toggleFilterModal}
									className="bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md mr-2"
								>
									Apply
								</button> */}
								<button
									type="button"
									onClick={() => {
										setFilterOptions({ type: "", status: "", dueDate: "" });
									}}
									className="bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-md"
								>
									Clear
								</button>
							</div>
						</form>
					</Modal.Body>
				</Modal>
				<div>
					<Modal open={open} onClose={handleClose}>
						<Modal.Header>
							<Modal.Title>User Details</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<form className=" px-8 py-6 space-y-4">
								<div>
									<label className="block" htmlFor="email">
										Email:
									</label>
									<Input
										id="email"
										type="email"
										className={cx(
											"w-full",
											"border",
											"rounded",
											"px-4",
											"py-2"
										)}
										placeholder="Enter email"
										value={userinputdata?.email}
										disabled
									/>
								</div>
								<div>
									<label className="block" htmlFor="firstName">
										First Name:
									</label>
									<Input
										id="firstName"
										type="text"
										className={cx(
											"w-full",
											"border",
											"rounded",
											"px-4",
											"py-2"
										)}
										name="firstname"
										placeholder="Enter First Name"
										value={userinputdata?.firstname}
										// onChange={handleuserchange}
										onChange={(value) =>
											setuserinputdata({ ...formData, firstname: value })
										}
									/>
								</div>
								<div>
									<label className="block" htmlFor="lastName">
										Last Name:
									</label>
									<Input
										id="lastName"
										type="text"
										className={cx(
											"w-full",
											"border",
											"rounded",
											"px-4",
											"py-2"
										)}
										name="lastname"
										placeholder="Enter Last Name"
										value={userinputdata?.lastname}
										onChange={(value) =>
											setuserinputdata({ ...formData, lastname: value })
										}
									/>
								</div>
								<div>
									<label className="block" htmlFor="password">
										Password
									</label>
									<Input
										id="password"
										type="password"
										className={cx(
											"w-full",
											"border",
											"rounded",
											"px-4",
											"py-2"
										)}
										name="password"
										placeholder="Enter New Password"
										onChange={(e) => setPassword(e)}
									/>
								</div>
								{showOTPInput && (
									<div>
										<label className="block" htmlFor="otp">
											OTP:
										</label>
										<Input
											id="otp"
											type="text"
											className={cx(
												"w-full",
												"border",
												"rounded",
												"px-4",
												"py-2"
											)}
											placeholder="Enter OTP"
											value={otp}
											onChange={(e) => setOTP(e)}
											required
										/>
									</div>
								)}
							</form>
						</Modal.Body>
						<Modal.Footer>
							{showOTPInput ? (
								<Button onClick={handleVerify} appearance="primary">
									Save
								</Button>
							) : (
								<Button onClick={handleSendOTP} appearance="primary">
									Verify
								</Button>
							)}
						</Modal.Footer>
					</Modal>
				</div>
				<ToastContainer />
			</div>
		</>
	);
}