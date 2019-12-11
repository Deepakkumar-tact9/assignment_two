
var autofill, place;
jQuery(document).ready(function () {
	if(jQuery('#search_address_google').length > 0) {

		var billing_sel_country = jQuery("#billing_country").children("option:selected").val();
		fillData(billing_sel_country);
		jQuery("#billing_country").change(function () {
			billing_sel_country = jQuery(this).children("option:selected").val();
			fillData(billing_sel_country);
		});
	}
});

function fillData(billing_sel_country){
	var countries;
	if (ship_country.ship_countries.length > 0 && ship_country.ship_countries !== undefined) {
		countries = ship_country.ship_countries;
	}
	if(jQuery.inArray(billing_sel_country.toLowerCase(), countries) !== -1) {
		var options = {
			types: ['address'],
			componentRestrictions: {country: billing_sel_country.toLowerCase()}
		};
		autofill = new google.maps.places.Autocomplete((document.getElementById('search_address_google')), options);
		google.maps.event.addListener(autofill, 'place_changed', fillInBillingAddress );
		google.maps.event.addListener(autofill, 'place_changed', fillInShippingAddress );
	}
}

function fillInBillingAddress(){
	var place = autofill.getPlace();

	jQuery('#billing_postcode').val('');
	jQuery('#billing_address_2').val('');
	jQuery('#billing_address_1').val('');
	jQuery('#billing_city').val('');
	jQuery('#billing_phone').val('');
	jQuery('#billing_company').val('');

	for (var i = 0; i < place.address_components.length; i++) {

		var addressType = place.address_components[i].types[0];
		// filling country field
		if(addressType == 'country'){
			jQuery('#billing_country').val(place.address_components[i]['short_name']);
			jQuery('#billing_country').trigger('change');
		}
		// filling street address field
		if(addressType == 'street_number'){
			jQuery('#billing_address_1').val(place.address_components[i]['long_name']);
		} else {
			if( typeof ( place.address_components[i].types[1] != "undefined" ) ) {
				if( place.address_components[i].types[1] == 'sublocality' ) {
					jQuery('#billing_address_1').val(place.address_components[i]['long_name']);
				}
			}
		}
		// adding data to street address field
		if(addressType == 'route') {
			var addr = jQuery('#billing_address_1').val();
			if(addr != ''){
				addr = addr +' '+ place.address_components[i]['long_name'];
				jQuery('#billing_address_1').val(addr);
			} else {
				jQuery('#billing_address_1').val(place.address_components[i]['long_name']);
			}
		}

		// filling state field
		if(addressType == 'administrative_area_level_1'){
			var state = place.address_components[i]['short_name'];
			setTimeout(function explode(){
				jQuery('#billing_state').val(state);
				jQuery('#billing_state').trigger('change');
			},500);
		}

		// filling second address field
		if(addressType == 'neighborhood'){
			jQuery('#billing_address_2').val(place.address_components[i]['long_name']);
		} else if(addressType == 'sublocality_level_3'){
			jQuery('#billing_address_2').val(place.address_components[i]['long_name']);
		} else if(addressType == 'sublocality_level_2'){
			jQuery('#billing_address_2').val(place.address_components[i]['long_name']);
		}

		// filling location
		if(addressType == 'locality'){
			jQuery('#billing_city').val(place.address_components[i]['long_name']);
		}
		// filling postal code
		if(addressType == 'postal_code') {
			jQuery('#billing_postcode').val(place.address_components[i]['long_name']);
		}
	}
}

function fillInShippingAddress() {

	place = autofill.getPlace();

	jQuery('#shipping_postcode').val('');
	jQuery('#shipping_address_1').val('');
	jQuery('#shipping_address_2').val('');
	jQuery('#shipping_city').val('');
	jQuery('#shipping_company').val('');

	for (var i = 0; i < place.address_components.length; i++) {
		var addressType = place.address_components[i].types[0];
		// filling country field
		if(addressType == 'country'){
			jQuery('#shipping_country').val(place.address_components[i]['short_name']);
			jQuery('#shipping_country').trigger('change');
		}
		// filling street address field
		if(addressType == 'street_number'){
			jQuery('#shipping_address_1').val(place.address_components[i]['long_name']);
		} else {
			if( typeof ( place.address_components[i].types[1] != "undefined" ) ) {
				if( place.address_components[i].types[1] == 'sublocality' ) {
					jQuery('#shipping_address_1').val(place.address_components[i]['long_name']);
				}
			}
		}
		// adding data to street address field
		if(addressType == 'route') {
			var addr = jQuery('#shipping_address_1').val();
			if(addr != ''){
				addr = addr +' '+ place.address_components[i]['long_name'];
				jQuery('#shipping_address_1').val(addr);
			} else {
				jQuery('#shipping_address_1').val(place.address_components[i]['long_name']);
			}
		}

		// filling state field
		if(addressType == 'administrative_area_level_1'){
			var state = place.address_components[i]['short_name'];
			setTimeout(function explode(){
				jQuery('#shipping_state').val(state);
				jQuery('#shipping_state').trigger('change');
			},1500);
		}

		if(addressType == 'neighborhood'){
			jQuery('#shipping_address_2').val(place.address_components[i]['long_name']);
		} else if(addressType == 'sublocality_level_3'){
			jQuery('#shipping_address_2').val(place.address_components[i]['long_name']);
		} else if(addressType == 'sublocality_level_2'){
			jQuery('#shipping_address_2').val(place.address_components[i]['long_name']);
		}

		// filling location
		if(addressType == 'locality'){
			jQuery('#shipping_city').val(place.address_components[i]['long_name']);
		}
		// filling postal code
		if(addressType == 'postal_code'){
			jQuery('#shipping_postcode').val(place.address_components[i]['long_name']);
		}

	}
}
