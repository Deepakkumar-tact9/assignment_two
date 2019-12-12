jQuery(document).ready(function () {
	var autofillBill, autofillShip;
	if (jQuery('#search_address_google, #shipping_search_address_google').length > 0) {

		var billingFields = {
			address_1: '#billing_address_1',
			address_2: '#billing_address_2',
			postcode: '#billing_postcode',
			city: '#billing_city',
			state: '#billing_state'
		};

		var shippingFields = {
			address_1: '#shipping_address_1',
			address_2: '#shipping_address_2',
			postcode: '#shipping_postcode',
			city: '#shipping_city',
			state: '#shipping_state'
		};

		var bill_sel_country = jQuery("#billing_country").children("option:selected").val();
		var ship_sel_country = jQuery("#shipping_country").children("option:selected").val();

		jQuery("#billing_country").change(function () {
			bill_sel_country = jQuery(this).children("option:selected").val();
		});

		jQuery("#shipping_country").change(function () {
			ship_sel_country = jQuery(this).children("option:selected").val();
		});

		var billoptions = { types: ['address'], componentRestrictions: {country: bill_sel_country.toLowerCase()} };
		var shipoptions = { types: ['address'], componentRestrictions: {country: ship_sel_country.toLowerCase()} };

		autofillBill = new google.maps.places.Autocomplete((document.getElementById('search_address_google')), billoptions);
		autofillShip = new google.maps.places.Autocomplete((document.getElementById('shipping_search_address_google')), shipoptions);
	}

	jQuery("#search_address_google, #shipping_search_address_google").change(function () {
		var $this = jQuery(this);
		if ($this.attr('id') == 'search_address_google') {
			google.maps.event.addListener(autofillBill, 'place_changed', updateField(billingFields));
		} else {
			google.maps.event.addListener(autofillShip, 'place_changed', updateField(shippingFields));

		}
	});
});

function updateField(fieldsArray) {

	if (fieldsArray['address_1'] == '#billing_address_1') {
		var place = autofillBill.getPlace();
	} else {
		var place = autofillShip.getPlace();
	}

	if (place.address_components.length > 0) {
		var f_address_1 = fieldsArray['address_1'];
		var f_address_2 = fieldsArray['address_2'];
		var f_postcode = fieldsArray['postcode'];
		var f_city = fieldsArray['city'];
		var f_state = fieldsArray['state'];

		for (var i = 0; i < place.address_components.length; i++) {

			var addressType = place.address_components[i].types[0];

			// filling street address field
			if (addressType == 'street_number') {
				jQuery(f_address_1).val(place.address_components[i]['long_name']);
			} else {
				if (typeof (place.address_components[i].types[1] != "undefined")) {
					if (place.address_components[i].types[1] == 'sublocality') {
						jQuery(f_address_1).val(place.address_components[i]['long_name']);
					}
				}
			}

			// adding data to street address field
			if (addressType == 'route') {
				var addr = jQuery(f_address_1).val();
				if (addr != '') {
					addr = addr + ' ' + place.address_components[i]['long_name'];
					jQuery(f_address_1).val(addr);
				} else {
					jQuery(f_address_1).val(place.address_components[i]['long_name']);
				}
			}

			// filling state field
			if (addressType == 'administrative_area_level_1') {
				jQuery(f_state).val(place.address_components[i]['short_name']);
			}

			// filling second address field
			if (addressType == 'neighborhood') {
				jQuery(f_address_2).val(place.address_components[i]['long_name']);
			} else if (addressType == 'sublocality_level_3') {
				jQuery(f_address_2).val(place.address_components[i]['long_name']);
			} else if (addressType == 'sublocality_level_2') {
				jQuery(f_address_2).val(place.address_components[i]['long_name']);
			}

			// filling location
			if (addressType == 'locality') {
				jQuery(f_city).val(place.address_components[i]['long_name']);
			}
			// filling postal code
			if (addressType == 'postal_code') {
				jQuery(f_postcode).val(place.address_components[i]['long_name']);
			}
		}
	}
}