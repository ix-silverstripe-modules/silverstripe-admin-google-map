silverstripe-admin-google-map
=============================

This is a very basic module for getting a Google Map into the Silverstripe CMS.

It provides a map with a draggable pin that, upon being moved, updates latitude and longitude CMS fields.

![Screenshot](docs/screenshot.png)

## Installation

Install through composer.

Add the following line to your site's .env (with your Google Map key):

```
GOOGLE_MAP_KEY="your_key"
```

Don't forget to run ``dev/build?flush=all``

## Basic Usage

By default, the module will expect the following situation

1. There will be fields with the IDs `Form_ItemEditForm_Lat` and `Form_ItemEditForm_Lng` (fields with the names `Lat` and `Lng` will have these IDs given to them by SilverStripe).

You would then simply need to create a `GoogleMapField`, giving it a name as you would with a SilverStripe field, for example:

```
use WeAreKnit\SSAdminGoogleMap\GoogleMapField;

...

public function getCMSFields() {

	$fields = parent::getCMSFields();

	$fields->addFieldsToTab('Root.Location', [
		// Create hidden latitude field
		HiddenField::create('Lat'),
		// Create hidden longitude field
		HiddenField::create('Lng'),
		// Create Google map field
		GoogleMapField::create('Map', [
			// Override any default options
		])
	]);

	return $fields;
}
```

## Address geolocation

You can optionally add a text field that allows the user to search for a location. A button is provided for the user to click and update the map.

## Options

If your situation isn't the same as above, you can provide any of the following options to suit your setup.

These options can be passed as key => value pairs as the second argument of the `GoogleMapField` function. These options and their default values are:

```
$googleMapField = GoogleMapField::create("Map", [
	'height' => '500px',						  // The height of the map element
	'heading' => '',							  // A heading in a <h4> tag to appear before the map
	'lng_field' => 'Form_ItemEditForm_Lng',	   // The ID of the longitude input element
	'lat_field' => 'Form_ItemEditForm_Lat',	   // The ID of the latitude input element
	'tab' => 'Root_Location',					 // The ID of the tab that the map is in
	'address_field' => 'Address',				 // The ID of the address field (if it exists)
	'map_zoom' => 10,							 // The initial zoom level of the map
	'start_lat' => '51.508515',				   // The initial latitude of the map marker
	'start_lng' => '-0.125487'					// The initial longitude of the map marker
]);
```
