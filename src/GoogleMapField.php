<?php

namespace WeAreKnit\SSAdminGoogleMap;

use SilverStripe\Core\Environment;
use SilverStripe\Forms\LiteralField;
use SilverStripe\View\Requirements;

class GoogleMapField extends LiteralField
{
	public function __construct($name, $options = [])
	{
		$key = Environment::getEnv('GOOGLE_MAP_KEY');

		if (!$key) {
			return parent::__construct($name, '<p class="alert alert-secondary">Please set GOOGLE_MAP_KEY with a valid API key for the Google Map field to work</p>');
		}

		// Set map defaults
		$defaults = [
			"width" => "100%",
			"height" => "500px",
			"heading" => "",
			"lng_field" => "Form_ItemEditForm_Lng",
			"lat_field" => "Form_ItemEditForm_Lat",
			"address_field" => "Address",
			"map_zoom" => 10,
			"start_lat" => "51.508515",
			"start_lng" => "-0.125487"
		];

		// Merge provided options with defaults to create params
		$params = array_replace_recursive($defaults, $options);

		// Set css of map
		$css = "style='width: " . $params['width'] . "; height: " . $params['height'] . ";'";

		// Set up array to be fed to the JS
		$js = [
			"lat_field" => $params['lat_field'],
			"lng_field" => $params['lng_field'],
			"address_field" => $params['address_field'],
			"zoom" => $params['map_zoom'],
			"start_lat" => $params['start_lat'],
			"start_lng" => $params['start_lng'],
			"key" => $key
		];

		// Build content of form field

		$content = "";

		if ($params['heading']) {
			$content .= "<h4>" . $params['heading'] . "</h4>";
		}

		$content .= "<div id='admin-map-" . $name . "' class='admin-google-map' " . $css . " data-setup='" . json_encode($js) . "'></div>";

		$this->content = $content;

		// Establish requirements
		Requirements::javascript("weareknit/silverstripe-admin-google-map:client/javascript/admin-google-map.js");

		parent::__construct($name, $this->content);
	}
}
