// const addComment = async (req, res) => {
//     try {
//       const { text } = req.body;
//       const { organisationName, email } = req.user; 
  
//       const ticket = await Ticket.findOne({ key: req.params.key, organisationName });
//       if (!ticket) {
//         return res.status(404).json({ message: 'Ticket not found or does not belong to your organization' });
//       }
  
//       // Add the comment
//       ticket.comments.push({ user: req.user._id, text });
//       await ticket.save();
  
//       res.status(201).json({ message: 'Comment added successfully', ticket });
//     } catch (error) {
//       res.status(500).json({ message: 'Failed to add comment', error: error.message });
//     }
//   };
  
//   const editComment = async (req, res) => {
//     try {
//       const { text } = req.body;
//       const { organisationName, email } = req.user; 
  
//       // Find the ticket
//       const ticket = await Ticket.findOne({ key: req.params.key, organisationName });
//       if (!ticket) {
//         return res.status(404).json({ message: 'Ticket not found or does not belong to your organization' });
//       }
  
//       // Find the comment
//       const commentIndex = ticket.comments.findIndex(comment => comment._id === req.params.commentId);
//       if (commentIndex === -1) {
//         return res.status(404).json({ message: 'Comment not found' });
//       }
  
//       // Check if the user is the author of the comment
//       if (ticket.comments[commentIndex].user.toString() !== req.user._id.toString()) {
//         return res.status(403).json({ message: 'Unauthorized: You are not allowed to edit this comment' });
//       }
  
//       // Update the comment
//       ticket.comments[commentIndex].text = text;
//       await ticket.save();
  
//       res.status(200).json({ message: 'Comment updated successfully', ticket });
//     } catch (error) {
//       res.status(500).json({ message: 'Failed to update comment', error: error.message });
//     }
//   };
  
//   const deleteComment = async (req, res) => {
//     try {
//       const { organisationName, email } = req.user; // Assuming user details are available in req.user
  
//       // Find the ticket
//       const ticket = await Ticket.findOne({ key: req.params.key, organisationName });
//       if (!ticket) {
//         return res.status(404).json({ message: 'Ticket not found or does not belong to your organization' });
//       }
  
//       // Find the comment
//       const commentIndex = ticket.comments.findIndex(comment => comment._id === req.params.commentId);
//       if (commentIndex === -1) {
//         return res.status(404).json({ message: 'Comment not found' });
//       }
  
//       // Check if the user is the author of the comment
//       if (ticket.comments[commentIndex].user.toString() !== req.user._id.toString()) {
//         return res.status(403).json({ message: 'Unauthorized: You are not allowed to delete this comment' });
//       }
  
//       // Remove the comment
//       ticket.comments.splice(commentIndex, 1);
//       await ticket.save();
  
//       res.status(200).json({ message: 'Comment deleted successfully', ticket });
//     } catch (error) {
//       res.status(500).json({ message: 'Failed to delete comment', error: error.message });
//     }
    
//   };
  