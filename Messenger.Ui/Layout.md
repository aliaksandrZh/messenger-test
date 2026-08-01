Overview
The application interface is a responsive messaging layout split into two primary states: Active Chat View (top layout) and New Chat Creation View (bottom layout). Both layouts share a common sidebar and structural container.

Shared Layout Structure
Main Container: Outer window framing the application.

Sidebar (Left Panel):

Chat List: Vertical list of conversation items displaying User Name/Chat Name on the first line and Last Message / Typing... on the second line.

New Chat Button: Positioned at the bottom right of the sidebar list area (new chat).

User Profile Footer: Fixed bottom area displaying User Name and an avatar/status element.

Layout 1: Active Chat View (Top)
Chat Header (Top Right): Displays the active User Name / Chat Name.

Message History Area (Center Right):

Scrollable container for message bubbles.

Current User Messages: Right-aligned bubbles with a maximum width restriction (max message width: 60%).

Other Users' Messages: Left-aligned bubbles.

Message Input Footer (Bottom Right):

Text input field labeled Message Input.

Send Button: Positioned on the right side of the input field (Send).

Layout 2: New Chat Creation View (Bottom)
Header Area (Top Right): Input field for New chat name input (default - selected users names or random (if empty)).

Contact Selection List (Center Right):

List of selectable contacts (Contact 1, Contact 2, Contact 3).

Each row includes a checkbox indicator (e.g., checked state with a checkmark for Contact 1, unchecked for others).

Action Footer (Bottom Right):

Create Button: Full-width or centered button labeled Create to finalize and start the new chat.