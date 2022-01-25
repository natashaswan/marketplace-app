# Marketplace web app and React.js/Firebase v9/Firestore Application

> Individual Project for "React Front to Back 2022" course. 

### Status: complete, this is a tutorial version with minor chages.
___
## Table of Contents
1. [Description](#description)
2. [Features](#features)
3. [Installation Requirements](#installation-requirements)
4. [Improvement Opportunities and known bugs](#improvement-opportunities)
5. [Technologies Used](#technologies-used)

---
## Description
The app allows users to browse property listings for rent and sale. User can register with Google mail or on the website using a form. Registered users can add listings, edit and delete them. 

## App structure
- **Homepage** with a navigation menu, carousel of newly added listings and two category links.
- **Category/rent(sale).** Listings of property for rent, three per page with a "load more" button at the end of the list. Clicking on a listing opens the listing's page. 
- **Listing's page** with a carousel of property images and property information. At the bottom of the page, there is a location map (map currently not active). The share button at the top right corner lets user copy the listing's link. 
- **Offers page** has listings that have discounted price set to true. Three listings per page with an ability to load more by clicking the "load more" button. 
- **Profile page** with personal details section that has registered user's email and used name. User can update their name by clicking the "update name" button below the personal details section. The button activates the name field and lets user type in it. "Sell or Rent your home" button which takes user on the create listing page. Your listings section has all listings  posted by the user. The delete button lets user delete the listing. The edit button takes user to the update listing page.
- **Create listing page** with toggle-buttons for choosing between sell/rent, parking spot?, furnished?, offer?; text fields for title, address and price; images section lets user upload images. Many fields are required. Pressing "Save Listing" saves the listing in the firestore database. Success/error msg notifies user about the progress. 
- **Edit listing page** opens a form that is pre-filled with existing property info except for images. Images field is required. Currently there is no way to update images, but user can upload more. 

## Features

- Any user has access to/can:
  - listings for rent/sale,
  - copy a link to a listing,
  - see full info about a listing by clicking on a listing,
  
- Registered users can:
  - create, update, delete listings,
  - update name in profile.

## Some tech specs
- Two db in firestore: one holds info about the users, another about the listings.
- Images are saved to firebase storage. Url links to images are stored in listings' db.
- Carousel on the homepage of newly added listings and 
- There is a limit of maximum 6 images for listing. 
  
  - progress when uploading images shown in console
  - error/success notifications.
  - load icon


## Improvement Opportunities and known bugs
1. Change create listing button to smth more visible.
2. Addresses not shown on the listing.
3. Edit listing: if images not uploaded edit listing will not work. 
4. Add indication and perhaps list of uploaded images when editing listing.
5. Uploading two identical images are currently possible with the user not being able to see what they upload.


## Technologies used
1. HTML
2. CSS
3. JavaScript
4. Firebase
5. Firestore
6. React

## Installation Requirements

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Special Thanks
Boilerplate, Style and app architecture credit goes to [@bradtraversy](https://github.com/bradtraversy). Another huge thank you for support goes to [@WillAdams](https://github.com/bushblade)




