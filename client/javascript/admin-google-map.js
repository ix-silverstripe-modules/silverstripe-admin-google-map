/**
 * Influenced by: https://github.com/kinglozzer/SilverStripe-GMapsObject/blob/master/javascript/GMapsObject.js
 */

var ss = ss || {};

ss.loadedGoogleMapsApi = false;

(function($) {

	$.entwine('ss', function($) {
		$('.admin-google-map').entwine({

			onmatch: function() {

				let script = null;
				let opts = $(this).data('setup');

				if (ss.loadedGoogleMapsApi === false) {
					script = document.createElement('script');
					script.type = 'text/javascript';
					script.src = '//maps.googleapis.com/maps/api/js?key=' + opts.key + '&sensor=false&callback=initAdminGoogleMaps';

					document.body.appendChild(script);

					ss.loadedGoogleMapsApi = true;
				}
				else {
					initAdminGoogleMaps();
				}
			}
		});
	});

})(jQuery);


function initAdminGoogleMaps() {

	(function($) {

		let geocoder = new google.maps.Geocoder();

		$('.admin-google-map').each(function(){

			let $this = $(this);

			let $addressField = null;
			let $updateMapBtn = null;

			let opts = $this.data('setup');
			let geocodeSearchTimer = null;
			let latField = $('#' + opts.lat_field);
			let lngField = $('#' + opts.lng_field);
			let latVal = latField.val() || opts.start_lat;
			let lngVal = lngField.val() || opts.start_lng;
			let addressVal = '';
			let newAddress = '';
			let latLng = new google.maps.LatLng(latVal, lngVal);
			let mapOptions = {
				center: latLng,
				zoom: opts.zoom
			};
			let map = new google.maps.Map($this[0], mapOptions);
			let marker = new google.maps.Marker({
				position: latLng,
				map: map,
				draggable: true,
				animation: google.maps.Animation.DROP
			});

			map.setCenter(latLng);

			function setLatLng(lat, lng, panMap) {
				let center = new google.maps.LatLng(lat, lng)
				marker.setPosition(center);
				latField.val(lat);
				lngField.val(lng);

				if (panMap !== undefined) {
					map.panTo(center);
				}
			}

			google.maps.event.addListener(marker, 'dragend', function() {
				let markerPos = marker.getPosition();
				let newLat = markerPos.lat();
				let newLng = markerPos.lng();

				setLatLng(newLat, newLng);

			});

			if (opts.address_field !== undefined) {

				$addressField = $('.cms-edit-form input[name=' + opts.address_field + '], .cms-edit-form textarea[name=' + opts.address_field + ']');

				addressVal = $addressField.val();
				newAddress = addressVal;

				if (!$addressField.next().is('button')) {

					$addressField.parent().addClass('input-group');
					$updateMapBtn = $('<button type="button" class="btn btn-outline-secondary form__field-update-url">Update map</button>')
						.insertAfter($addressField)
						.on('click', function() {

							newAddress = $addressField.val();

							geocoder.geocode({
									'address': newAddress
								}, function(responses) {
									if (responses && responses.length > 0) {

										let lat = responses[0].geometry.location.lat();
										let lng = responses[0].geometry.location.lng();

										setLatLng(lat, lng, true);
									}
								}
							);

							addressVal = newAddress;
						});

				}
			}
		});

	})(jQuery);
}
