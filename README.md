**Main Functionality:**

1. The user enters the note's text.  
2. The note is encrypted on the user's device using a unique key.  
3. The encrypted text is sent to the server for storage.  
4. The application returns a link containing the note's ID and the encryption key.  
5. The recipient decrypts and reads the note by following the link.  
6. The note is deleted from the server after the first view.  
7. If the note is not read within 24 hours, it is automatically deleted.


To install:
- npm install nodejs
- npm install

    Dev:
    - npm run dem

    Production:
    - npm run build


If you need the server code you can write me message to kurilchanin.t.me