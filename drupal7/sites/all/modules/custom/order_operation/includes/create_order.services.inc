<?php

function order_services_resource() {
	$api = array(
		'cart' => array(
			'operations' => array(
				'create' => array(
					'help' => 'Creates a new cart order for the current API user.',
					'file' => array(
						'type' => 'inc',
						'module' => 'order_operation',
						'name' => 'includes/create_order.services',
					),
					'callback' => 'commerce_services_order_create',
					'access callback' => 'user_access',
					'access arguments' => array('access content'),
					'access arguments append' => FALSE,
					'args' => array(
						array(
							'name' => 'account',
							'type' => 'array',
							'description' => 'The user object',
							'source' => 'data',
							'optional' => FALSE,
						),
					),
				),
				'retrieve' => array(
					'help' => 'Display the current user cart product',
					'file' => array(
						'type' => 'inc',
						'module' => 'order_operation',
						'name' => 'includes/create_order.services',
					),
					'callback' => 'commerce_services_view_cart',
					'access callback' => 'user_access',
					'access arguments' => array('access content'),
					'access arguments append' => FALSE,
					'args' => array(
						array(
							'name' => 'uid',
							'type' => 'int',
							'description' => 'The uid of the user to retrieve.',
							'source' => array('path' => 0),
							'default value' => 0,
						),
					),
				),
			),
			'actions' => array(
				'billing_profile_create' => array(
					'help' => 'Creating billing profile and changing the status to order complete',
					'callback' => 'billing_complete_order_status',
					'args' => array(
						array(
							'name' => 'uid',
							'type' => 'array',
							'description' => 'A valid billing profile detail',
							'source' => 'data',
							'optional' => TRUE,
						),
					),
					'access callback' => 'services_access_menu',
					'file' => array('type' => 'inc', 'module' => 'order_operation', 'name' => 'includes/create_order.services'),
				),
				'update' => array(
					'help' => 'update the status',
					'callback' => 'update_order_status',
					'args' => array(
						array(
							'name' => 'uid',
							'type' => 'int',
							'description' => 'A valid uid',
							'source' => array('data' => 'uid'),
							'optional' => TRUE,
						),
					),
					'access callback' => 'services_access_menu',
					'file' => array('type' => 'inc', 'module' => 'order_operation', 'name' => 'includes/create_order.services'),
				),
			),
		),
	);

	return $api;
}

function commerce_services_order_create($node) {
	$quantity = "";
	$user_id = $node['uid'];
	$pid = $node['pid'];
	
	$quantity = $node['quantity'];
	if ($quantity == "") {
		$quantity = 1;
	}
	commerce_cart_product_add_by_id($pid, $quantity, TRUE, $user_id);
}

function commerce_services_view_cart($uid) {
	if(!empty($uid)){
	$cart_order = commerce_cart_order_load($uid);
	$order_total = number_format(($cart_order->commerce_order_total['und'][0]['amount'] / 100), 2, '.', '');
	foreach ($cart_order->commerce_line_items['und'] as $line_item) {
		$product_line_item = commerce_line_item_load($line_item['line_item_id']);
		$line_item_total = number_format(($product_line_item->commerce_total['und'][0]['amount'] / 100), 2, '.', '');
		$quantity = round($product_line_item->quantity);
		foreach ($product_line_item->commerce_product['und'] as $product) {
			$product = commerce_product_load($product['product_id']);
			$image_path = file_create_url($product->field_product_image['und'][0]['uri']);
			$price = number_format(($product->commerce_price['und'][0]['amount'] / 100), 2, '.', '');
			$return_obj[] = array(
				'name' => $product->title,
				'image' => $image_path,
				'price' => $price,
				'total' => $line_item_total,
				'quantity' => $quantity,
				'order_total' => $order_total,
			);
		}
	}
	
	return $return_obj;
	}
}

function update_order_status($uid) {
	$cart_order = commerce_cart_order_load($uid);
	$cart_order->status = 'checkout_checkout';
	commerce_order_save($cart_order);
}

function billing_complete_order_status($billingprofile) {


	$uid = $billingprofile['uid'];
	$fname = $billingprofile['fname'];
	$lname = $billingprofile['lname'];
	$add1 = $billingprofile['add1'];
	$add2 = $billingprofile['add2'];
	$state = $billingprofile['state'];
	$country = $billingprofile['country'];
	$zip = $billingprofile['zip'];

	$cart_order = commerce_cart_order_load($uid);


	$profile = commerce_customer_profile_new('billing', $uid);
	$profile->commerce_customer_address['und'][0]['name_line'] = $fname . ' ' . $lname;
	$profile->commerce_customer_address['und'][0]['thoroughfare'] = $add1;
	$profile->commerce_customer_address['und'][0]['premise'] = $add2;
	$profile->commerce_customer_address['und'][0]['postal_code'] = $zip;
	$profile->commerce_customer_address['und'][0]['administrative_area'] = $state;
	$profile->commerce_customer_address['und'][0]['country'] = $country;

	commerce_customer_profile_save($profile);
	$cart_order->commerce_customer_billing[LANGUAGE_NONE][0]['profile_id'] = $profile->profile_id;
	$cart_order->status = 'completed';

	commerce_order_save($cart_order);
}
