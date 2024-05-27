
  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
  //     const token = cookies.get('token');
  //     if (!token) {
  //       navigate('/userlogin');
  //       return;
  //     }

  //     let filesArray: { name: string, url: string }[] = [];
  //     if (formData.files !== null) {
  //       filesArray = Array.from(formData.files).map(file => ({ name: file.name, url: URL.createObjectURL(file) }));
  //     }

  //     const response = await fetch('http://localhost:5000/user/tickets/create', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify({
  //         type: formData.type,
  //         summary: formData.summary,
  //         description: formData.description,
  //         assignee: formData.assignee,
  //         dueDate: formData.dueDate,
  //         files: filesArray
  //       })
  //     });

  //     if (response.ok) {
  //       const responseData = await response.json();
  //       toast.success(responseData.message || 'Ticket created successfully');
  //       setShowCreateTicketModal(false);
  //       fetchTickets(token);
  //       setFormData({
  //         type: '',
  //         summary: '',
  //         description: '',
  //         assignee: '',
  //         dueDate: '',
  //         files: null
  //       });
  //     } else {
  //       const errorData = await response.json();
  //       toast.error(errorData.message);
  //       console.error('Error creating ticket:', errorData.message);
  //     }
  //   } catch (error) {
  //     console.error('Error creating ticket:', error);
  //   }
  // };





    // const fetchTickets = async (token: string) => {
  //   try {
  //     const response = await fetch('http://localhost:5000/user/tickets', {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       setTickets(data.tickets);
  //     } else {
  //       throw new Error('Failed to fetch tickets');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching tickets:', error);
  //     // Handle error
  //   }
  // };



    // const handleSaveTicketChanges = async (updatedTicket: Ticket) => {
  //   try {
  //     const token = cookies.get('token');
  //     // console.log('Updated Ticket:', updatedTicket);
  //     const response = await fetch(`http://localhost:5000/user/tickets/update/${updatedTicket.key}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(updatedTicket),
  //     });

  //     if (response.ok) {
  //       toast.success('Ticket details updated successfully');
  //       fetchTickets(token);
  //       setShowTicketDetailsModal(false);
  //     } else {
  //       const errorData = await response.json();
  //       toast.error(errorData.message);
  //       console.error('Error updating ticket details:', errorData.message);
  //     }
  //   } catch (error) {
  //     console.error('Error updating ticket details:', error);
  //   }
  // };