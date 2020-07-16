<?php
/**
 * Sets up the Connection REST API endpoints.
 *
 * @package automattic/jetpack-connection
 */

namespace Automattic\Jetpack\Connection;

use WP_Error;
use WP_REST_Request;
use WP_REST_Server;

/**
 * Registers the REST routes for Connections.
 */
class REST_Connector {
	/**
	 * The Connection Manager.
	 *
	 * @var Manager
	 */
	private $connection;

	/**
	 * Constructor.
	 *
	 * @param Manager $connection The Connection Manager.
	 */
	public function __construct( Manager $connection ) {
		$this->connection = $connection;

		if ( ! $this->connection->is_active() ) {
			// Register a site.
			register_rest_route(
				'jetpack/v4',
				'/verify_registration',
				array(
					'methods'  => WP_REST_Server::EDITABLE,
					'callback' => array( $this, 'verify_registration' ),
				)
			);
		}

		// Full or partial reconnect in case of connection issues.
		register_rest_route(
			'jetpack/v4',
			'/connection/reconnect',
			array(
				'methods'  => WP_REST_Server::EDITABLE,
				'callback' => array( $this, 'connection_reconnect' ),
				'args'     => array(
					'action' => array(
						'type'     => 'string',
						'required' => true,
					),
				),
			)
		);
	}

	/**
	 * Handles verification that a site is registered.
	 *
	 * @since 5.4.0
	 *
	 * @param \WP_REST_Request $request The request sent to the WP REST API.
	 *
	 * @return string|WP_Error
	 */
	public function verify_registration( \WP_REST_Request $request ) {
		$registration_data = array( $request['secret_1'], $request['state'] );

		return $this->connection->handle_registration( $registration_data );
	}

	/**
	 * The endpoint tried to partially or fully reconnect the website to WP.com.
	 *
	 * @since 8.8.0
	 *
	 * @param WP_REST_Request $request The request sent to the WP REST API.
	 *
	 * @return \WP_REST_Response|WP_Error
	 */
	public function connection_reconnect( WP_REST_Request $request ) {
		$params = $request->get_json_params();

		$response = array();

		switch ( $params['action'] ) {
			case 'reconnect':
				$result = $this->connection->reconnect();

				if ( true === $result ) {
					$response['status']       = 'in_progress';
					$response['authorizeUrl'] = $this->connection->get_authorization_url();
				} elseif ( is_wp_error( $result ) ) {
					$response = $result;
				}
				break;
			default:
				$response = new WP_Error( 'Unknown action' );
				break;
		}

		return rest_ensure_response( $response );
	}

}
