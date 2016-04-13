<?php

function category_listing_services_resource() {
	$api = array(
		'category_listing' => array(
			'operations' => array(
				'retrieve' => array(
					'help' => 'To list all the category',
					'file' => array(
						'type' => 'inc',
						'module' => 'product_listing_service',
						'name' => 'includes/category_listing_service.services',
					),
					'callback' => 'category_listing_retrieve',
					'access callback' => 'user_access',
					'access arguments' => array('access content'),
					'access arguments append' => FALSE,
					'args' => array(
						array(
							'name' => 'vocublary',
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
		'category_wise_listing' => array(
			'operations' => array(
				'retrieve' => array(
					'help' => 'To list all products belong that category',
					'file' => array(
						'type' => 'inc',
						'module' => 'product_listing_service',
						'name' => 'includes/category_listing_service.services',
					),
					'callback' => 'category_wise_listing_retrieve',
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
							'name' => 'tid',
							'type' => 'int',
							'description' => 'Function to perform',
							'source' => array('param' => 'tid'),
							'optional' => TRUE,
						),
					),
				),
			),
		),
	);

	return $api;
}

function category_listing_retrieve($vocabulary_machine_name) {

	$query = db_select('taxonomy_vocabulary', 'tv');

	$query->join('taxonomy_term_data', 'td', 'tv.vid = td.vid');
	$query->join('taxonomy_term_hierarchy', 'th', 'th.tid = td.tid');
	$query->condition('tv.machine_name', $vocabulary_machine_name);
	$query->condition('th.parent', '0', '=');
	$query->fields('td', array('name'));
	$query->fields('th');
	$category_list = $query->execute()->fetchAll();

	foreach ($category_list as $category) {
		$return_obj[] = array(
			'name' => $category->name,
			'tid' => $category->tid,
		);
	}
	return $return_obj;
}

function category_wise_listing_retrieve($node_type, $tid) {
    //return $tid.'aaaaa'.$node_type;
    $query = db_select('node', 'n');
    $query->join('field_data_field_product', 'fp', 'fp.entity_id = n.nid');
    $query->join('field_data_field_category', 'c', 'fp.field_product_product_id = c.entity_id');
    $query->join('field_data_commerce_price', 'cp', 'cp.entity_id = fp.field_product_product_id');
    $query->join('field_data_field_product_image', 'fi', 'fi.entity_id = fp.field_product_product_id');
    $query->join('file_managed', 'f', 'f.fid = fi.field_product_image_fid ');
    $query->condition('n.type', $node_type);
    $query->condition('c.field_category_tid', $tid);
    $query->fields('n', array('nid'));
    $query->fields('n', array('title'));
    $query->fields('fp', array('field_product_product_id'));
    $query->fields('cp', array('commerce_price_amount'));
    $query->fields('f', array('uri'));
    $category_wise_list_product = $query->execute()->fetchAll();

    foreach ($category_wise_list_product as $category_product) {
        $commerce_price = $category_product->commerce_price_amount;
        $price = $commerce_price / 100;
        $image_path = file_create_url($category_product->uri);
        $return_obj[] = array(
            'name' => $category_product->title,
            'price' => $price,
            'image' => $image_path,
            'nid' => $category_product->nid,
            'pid' => $category_product->field_product_product_id,
        );
    }
    return $return_obj;
}
