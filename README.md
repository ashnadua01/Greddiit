## GREDDIIT
### Made with Love by Ashna Dua

### Register Page:
This page opens a form for a new user to register. If the required fields is missing, it shows an alert. Also, if the username or email exists, it shows an alert as well. 

#### Assumptions:
1. Phone number of a user may not be unique, but username and email must be unique. 
<br/>

### Login Page:
This page opens a form for a user to login. It gives appropriate alerts if a user is not found, or if password is incorrect. 

#### Assumptions: NA
<br/>

### Dashboard:
This page shows all the required navbar links, and a welcome text to the user. 

#### Assumptions: NA
<br/>

### Profile:
This page shows the name and username of the currently logged in user. It has 2 buttons, one for Edit Profile, and one for Logout. If the Edit Profile button is clicked, a form opens which allows the user to edit their details. If the user clicks on Logout, he/she is logged out from their account.

#### Assumptions:
1. A user can edit atleast one field in the edit profile form i.e they can edit only their name, or only their phone number etc, or multiple entries as well. If the form is empty it throws an error.
2. When followers is clicked, it opens a modal which displays the list of followers. There is a remove button, which deletes the selected user from the followers of the current user, and the current user is deleted from the following of the selected user.
3. The same thing has been implemented for Following.
<br/>

### My Sub Greddiits:
This page shows the list of all Sub Greddiits created by the current user. There is also a create button, which opens a form in which a user can enter the required details of a new Sub Greddit. Each Sub Greddit has a button to open the Sub Greddit, and a button to delete the Sub Greddiit.

#### Assumptions:
1. A Sub Greddiit has 1 follower by default, i.e. the owner. 
2. There is an Open and Delete button to open and delete the Sub Greddiit. 
3. Name, description, number of posts, number of followers, and banned keywords are displayed for every Sub Greddiit. 
3. Banned Keywords of a Sub Greddiit are displayed as a comma separated list.
4. When a Sub Greddiit is deleted, all it's posts, and reports are automatically deleted. 
<br/>

### Sub Greddits:
This page shows the list of all Sub Greddiits (Joined and Remaining) created by any user. It has a search button, which can be used to search through the list of Sub Greddits. There is a drop down button to sort these Sub Greddiits on the basis of their name, followers and creation date. A Sub Greddiit can be joined by anybody and the request to join is sent to the moderator.

#### Assumptions: 
1. All the Joined Sub Greddiits have a button to open or leave the Sub Greddiit.
2. When the Sub Greddiit is opened, the same page is displayed that is displayed for the moderator when he/she opens the Sub Greddiit from their My Sub Greddiits page.
3. If a user Leaves the Sub Greddiit they follow and they try to follow again, an alert is given to the user that they cannot join again. 
4. If a user has been blocked from the Sub Greddiit, and tries to join the Sub Greddiit again, it shows an alert that they are blocked and cannot join the Sub Greddiit again. 
5. There is a search form, which implements fuzzy search only for the name of the Sub Greddiit.
6. A sort button has a dropdown button, which when clicked shows 4 options to sort the Sub Greddiits: Name (Ascending Order), Name (Descending Order), Followers, and Creation Date.
7. If there are no Sub Greddiits in any of the headings, it shows an appropriate message that there are no Sub Greddiits (Joined or Remaining).
<br/>

### Page:
When the Sub Greddiit is opened, a new page is opened, which displays the posts in it. There is also a button to create post which creates a new post and displays it. Each post has upvote and downvote buttons. There is also a feature to comment, report and save the post as well. If the current user is the moderator (owner) of the Sub Greddiit, 4 new navbar links (Users, Stats, Reports and Requests) are also added.

#### Assumptions:
1. If the current user is the creator of the Sub Greddiit, the navbar has 4 new links. If the user is not owner, then these links are not displayed.
2. Each post displays the title of the post, it's creator, it's content as well as buttons for upvoting, downvoting, commenting, saving and reporting.
3. A post can be upvoted as well as downvoted. Have not implemented that they should be upvoted or downvoted at once.
4. Comment button when clicked displays a field to add a comment, as well as displays the comments that are added for that post. 
5. When the save button is clicked, the post is saved and it is displayed in saved page of the user.
6. Report button when clicked opens a field to enter the concern for the report. After submittion, it creates a report for that post. If a user tries to report themselves, or the moderator, an alert is displayed regarding the same. If a user tries to report again and again, then an alert is also displayed that the user has already reported this post.
<br/>

### Saved Posts:
All the posts saved by a user appear here, with upvote, downvote, comment, and report feature as well.

#### Assumptions: NA
<br/>

### Users (only visible to moderator):
This page shows all the users of a Sub Greddiit (Blocked and Unblocked).

#### Assumptions: NA
<br/>

### Requests (only visible to moderator):
This page shows all the requests to join the Sub Greddiit. If the request is accepted, the user is added as a follower of the Sub Greddiit. If the request is rejected, then the request is deleted without any action.

#### Assumptions:
1. Each request shows the username and 2 buttons, Accept and Reject.
2. If the moderator accepts the request, the requester is addeed as a follower of the Sub Greddiit. 
3. If the request is rejected, then the request is deleted, with no action.
<br/>

### Reports (only visible to moderator):
This page shows all the reports in a Sub Greddiit. It has 3 buttons for every report, Ignore, Delete Post and Block User. If a report has not been handeled since 10 days, the report is automatically deleted.

#### Assumptions:
1. Every report shows the name of the reporter as well as the reported user. It also shows the concern and the post content. 
2. Every report has 3 actions, Block User, Delete Post and Ignore.
3. If the report is ignored, it shows an alert that the report has been ignored, and the delete post and block user are disabled.
4. If the Block User button is clicked, then the user is blocked from the Sub Greddiit, and the post shows the name of the creator as 'Blocked User'
5. If the Delete Post button is clicked, then the post is deleted.
6. If NO ACTION has been taken for a report, it is deleted in 10 days (variable).
<br/>

### Stats (only visible to moderator):
This page shows the growth of followers for a Sub Greddiit in the form of a table. It is updates each time a user joins, leaves or is blocked.

#### Assumptions:
1. The table grows each time followers of a Sub Greddiit is updated.
<br/>

### Miscc:
If a user is not logged in page is tried to access, it prints a user is not logged in
Most pages need a reaload to show the updated data, hence automatic reload has been added.
