<?php

function product_listing_services_resource() {
	$api = array(
		'product_listing' => array(
			'operations' => array(
				'retrieve' => array(
					'help' => 'To list all the products',
					'file' => array(
						'type' => 'inc',
						'module' => 'product_listing_service',
						'name' => 'includes/product_listing_service.services',
					),
					'callback' => 'product_listing_retrieve',
					'access callback' => 'user_access',
					'access arguments' => array('access content'),
					'access arguments append' => FALSE,
					'args' => array(
						array(
							'name' => 'category',
							'type' => 'string',
							'description' => 'Function to perform',
							'source' => array(
								'path' => '0'
							),
							'optional' => TRUE,
							'default' => '0',
						),
					),
				),
			),
		),
		'product_display_page' => array(
			'operations' => array(
				'retrieve' => array(
					'help' => 'To display the particular product',
					'file' => array(
						'type' => 'inc',
						'module' => 'product_listing_service',
						'name' => 'includes/product_listing_service.services',
					),
					'callback' => 'product_display_retrieve',
					'access callback' => 'user_access',
					'access arguments' => array('access content'),
					'access arguments append' => FALSE,
					'args' => array(
						array(
							'name' => 'path',
							'type' => 'string',
							'description' => 'Function to perform',
							'source' => array(
								'path' => '0'
							),
							'optional' => TRUE,
						),
						array(
							'name' => 'nid',
							'type' => 'int',
							'description' => 'Function to perform',
							'source' => array('param' => 'nid'),
							'optional' => TRUE,
						),
					),
				),
			),
		),
	);

	return $api;
}

function product_listing_retrieve($node_type) {
	$return_obj = array();
	$query = db_select('node', 'n');
	$query->join('field_data_field_product', 'fp', 'fp.entity_id = n.nid');
	$query->join('field_data_commerce_price', 'cp', 'cp.entity_id = fp.field_product_product_id');
	$query->join('field_data_field_product_image', 'fi', 'fi.entity_id = fp.field_product_product_id');
	$query->join('file_managed', 'f', 'f.fid = fi.field_product_image_fid ');
	$query->condition('n.type', $node_type);
	
	$query->fields('fp', array('field_product_product_id'));
	$query->fields('n', array('title'));
	$query->fields('n', array('nid'));
	$query->fields('cp', array('commerce_price_amount'));
	$query->fields('f', array('uri'));

	$product_list = $query->execute()->fetchAll();


	foreach ($product_list as $product) {
		$commerce_price = $product->commerce_price_amount;
		$price = $commerce_price / 100;
		$image_path = file_create_url($product->uri);
		$return_obj[] = array(
			'name' => $product->title,
			'price' => $price,
			'image' => $image_path,
			'nid' => $product->nid,
			'pid' => $product->field_product_product_id
		);
	}
	return $return_obj;
}

function product_display_retrieve($node_type, $nid) {
	$query = db_select('node', 'n');
	$query->join('field_data_field_product', 'fp', 'fp.entity_id = n.nid');
	$query->join('field_data_commerce_price', 'cp', 'cp.entity_id = fp.field_product_product_id');
	$query->join('field_data_field_product_image', 'fi', 'fi.entity_id = fp.field_product_product_id');
	$query->join('file_managed', 'f', 'f.fid = fi.field_product_image_fid ');
	$query->condition('n.type', $node_type);
	$query->condition('n.nid', $nid);

	$query->fields('fp', array('field_product_product_id'));
	$query->fields('n', array('title'));
	$query->fields('n', array('nid'));
	$query->fields('cp', array('commerce_price_amount'));
	$query->fields('f', array('uri'));
	
	$product_list = $query->execute()->fetchAll();

	foreach ($product_list as $product) {
		$commerce_price = $product->commerce_price_amount;
		$price = $commerce_price / 100;
		$image_path = file_create_url($product->uri);
		$return_obj[] = array(
			'name' => $product->title,
			'price' => $price,
			'image' => $image_path,
			'pid' => $product->field_product_product_id
		);
	}
	return $return_obj;
}
