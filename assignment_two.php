<?php
/**
 * Plugin Name: Assignment Two
 * Text Domain: assignment-two
 * Plugin URI: https://www.wisetr.com
 * Author: Deepak Kumar
 * Author URI: https://www.wisetr.com
 * Description: Deepak kumar progress second assignment for fill checkout page billing and shipping address by google api
 * Version: 1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit();
}
include_once(ABSPATH.'wp-admin/includes/plugin.php');



class AsignTwo_plugin {

	private static $_instance = null;
    public $discount_percentage = 20;
	function __construct() {
		if ( ! is_plugin_active( 'woocommerce/woocommerce.php' ) ) {
			add_action( 'admin_init', array( $this, 'woocommerce_active' ) );
			return;
		}
		add_action( 'woocommerce_default_address_fields', array( $this, 'add_custom_field' ), 10, 1);
		add_filter( 'woocommerce_shipping_fields', array( $this, 'change_field_id' ));
		add_action( 'wp_enqueue_scripts', array( $this, 'reg_enqueue_script' ) );
		add_action('woocommerce_checkout_update_order_meta', array( $this, 'save_search_address' ));
		add_action( 'woocommerce_thankyou', array( $this, 'show_map' )  );
	}

	public static function get_instance() {
		if ( null === self::$_instance ) {
			self::$_instance = new self;
		}
		return self::$_instance;
	}

	private function woocommerce_active() {
		add_action( 'admin_notices', array( $this, 'deactivate_notice' ) );
	}

	private function deactivate_notice() {
		echo '<div class="notice notice-error">This plugin requires WooCommerce plugin in order to run. Kindly install it.
		</div>';
	}

	public function add_custom_field( $address_fields ){
		$temp_fields = array();
		$temp_fields['search_address_google'] = array(
			'id'          => 'search_address_google',
			'class'       => array('form-row-wide'),
			'label'       => __( 'Search Address', 'assignment-two' ),
			'required'    => false,
			'placeholder' => 'Search Address',
		);

		$addposition = array_search('address_1', array_keys($address_fields));
		$this->array_insert($address_fields, $addposition, $temp_fields);
		return $address_fields;
	}

	public function change_field_id( $address_fields ){

		if(isset($address_fields['shipping_search_address_google']) && $address_fields['shipping_search_address_google']['id'] != ''){
			$address_fields['shipping_search_address_google']['id'] = 'shipping_search_address_google';
		}
		return $address_fields;
	}

	public function reg_enqueue_script() {
		$url = plugin_dir_url( __FILE__ ).'/assets/js/filldata.js';
		$countries = array();
		$country = array();

		$key = 'AIzaSyAS0ej-pmiCotjgm97UfDlrpb24-YXuo0g';
		$api_url = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key='.$key.'';

		// adding scripts
		wp_register_script( 'assignment-filldata', $url, array( 'jquery' ), '1.0.0', true );
		wp_register_script( 'assignment-api', "$api_url", array(), '', true );
		wp_enqueue_script( 'assignment-filldata' );
		wp_enqueue_script( 'assignment-api' );

		$countries = WC()->countries->get_shipping_countries();
		foreach($countries as $key => $value){
			$country[] = strtolower($key);
		}

		wp_localize_script( 'assignment-filldata', 'ship_country',
			array(
				'ship_countries'         => $country,
			)
		);
	}

	private function array_insert (&$array, $position, $insert_array) {
		$first_array = array_splice ($array, 0, $position);
		$array = array_merge ($first_array, $insert_array, $array);
	}

	public function save_search_address( $order_id ) {
		if ($_POST['billing_search_address_google'] && $_POST['shipping_search_address_google']) {
			if ( $_POST['shipping_search_address_google'] != '' ) {
				$delevery_custom_address = $_POST['shipping_search_address_google'];
			}else{
				$delevery_custom_address = $_POST['billing_search_address_google'];
			}
			update_post_meta( $order_id, 'delevery_custom_address', esc_attr($delevery_custom_address));
		}
	}

	function show_map( $order_id ) {

		$map_address = '';
		$shipping_address = get_post_meta($order_id, '_shipping_search_address_google', true);
		$index_address = get_post_meta($order_id, '_shipping_address_index', true);

		if($shipping_address != ''){
			$map_address = $shipping_address;
		}else{
			$map_address = $index_address;
		}

		if($map_address != '' ) {
			echo '
				<iframe class="custom_map" src="https://maps.google.com/maps?f=q&source=s_q&hl=en&geocode=&q=' . str_replace( ",", "", str_replace( " ", "+", $map_address ) ) . '&z=14&output=embed"></iframe>
				<style type="text/css">
				 .custom_map{width:600px!important;height:450px!important;margin-top:35px;border:none}
				</style>
				';

		}
	}
}

if ( ! function_exists( 'AsignTwo_plugin' ) ) {
	function AsignTwo_plugin() {
		return AsignTwo_plugin::get_instance();
	}
}

AsignTwo_plugin();