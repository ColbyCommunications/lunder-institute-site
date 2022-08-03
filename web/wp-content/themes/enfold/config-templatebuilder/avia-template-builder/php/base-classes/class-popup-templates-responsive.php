<?php
namespace aviaBuilder\base;

//use \AviaHtmlHelper;

/**
 * Class implements modal popup templates for layout elements that are responsive.
 * Added to keep code of elements slim and better readable
 *
 * @added_by Günter
 * @since 5.0
 */
if( ! defined( 'ABSPATH' ) ) {  exit;  }    // Exit if accessed directly

if( ! class_exists( __NAMESPACE__ . '\aviaPopupTemplatesResppnsive' ) )
{
	class aviaPopupTemplatesResponsive extends \aviaBuilder\base\aviaPopupTemplatesCallback
	{

		/**
		 * @since 5.0
		 */
		protected function __construct()
		{
			parent::__construct();
		}

		/**
		 * @since 5.0
		 */
		public function __destruct()
		{
			parent::__destruct();
		}

		/**
		 * Slideshow Section - Margin and Padding Settings
		 *
		 * @since 5.0
		 * @param array $element
		 * @return array
		 */
		protected function slideshow_section_margin_padding( array $element )
		{
			$required = isset( $element['required'] ) ? $element['required'] : array();

			$resp_sizes_opts = ( isset( $element['resp_sizes_opts'] ) && is_array( $element['resp_sizes_opts'] ) ) ? $element['resp_sizes_opts'] : $this->resp_sizes_options;
			$resp_sizes_desc = ( isset( $element['resp_sizes_desc'] ) && is_array( $element['resp_sizes_desc'] ) ) ? $element['resp_sizes_desc'] : $this->resp_sizes_desc;

			$styles_cb = array(
								'method'	=> 'slideshow_section_margin_padding',
//								'id'		=> $id			//	hardcoded implementation
							);

			$template = array(
							array(
								'type'		=> 'icon_switcher_container',
//								'icon'		=> __( 'Content', 'avia_framework' ),
								'nodescription' => true,
								'required'	=> $required
							)
						);

			foreach( $resp_sizes_opts as $size => $resp_size_key )
			{
				$template[] = array(
								'type' 	=> 'icon_switcher',
								'name'	=> $this->resp_titles[ $size ],
								'icon'	=> $this->resp_icons[ $size ],
								'nodescription' => true
							);

				$el = array(
								'name'		=> __( 'Slideshow Section Top And Bottom Margin', 'avia_framework' ) . ' - '. $resp_sizes_desc[ $size ],
								'desc'		=> __( 'Set a custom top or bottom margin. Both pixel and &percnt; based values are accepted. eg: 30px, 5&percnt;. Leave empty for default or inherit desktop setting.', 'avia_framework' ),
								'id'		=> $resp_size_key . 'margin',
								'type'		=> 'multi_input',
								'sync'		=> true,
								'std'		=> '',
								'multi'		=> array(
													'top'		=> __( 'Margin Top', 'avia_framework' ),
													'bottom'	=> __( 'Margin Bottom', 'avia_framework' ),
												)
							);

				//	we only set callback method for default
				if( 'default' == $size )
				{
					$el['styles_cb'] = $styles_cb;
					$styles_cb = null;
				}

				$template[] = $el;


				$template[] = array(
								'name'		=> __( 'Slide Title Tabs Padding', 'avia_framework' ) . ' - '. $resp_sizes_desc[ $size ],
								'desc'		=> __( 'Define the slide title tabs top padding (only works if no icon is displayed at the top of the slide title)', 'avia_framework' ),
								'id'		=> $resp_size_key . 'tab_padding',
								'type'		=> 'select',
								'std'		=> '',
								'required'	=> array( 'element_layout', 'equals', 'tabs' ),
								'subtype'	=> array(
													__( 'Default Padding (10px)', 'avia_framework' )	=> '',
													__( 'No Padding', 'avia_framework' )				=> 'none',
													__( 'Small Padding (0)', 'avia_framework' )			=> 'small',
													__( 'Large Padding (20px)', 'avia_framework' )		=> 'large',
													__( 'Custom Padding', 'avia_framework' )			=> 'custom'
												)
							);

				$template[] = array(
								'name'		=> __( 'Custom Slide Title Tabs Padding', 'avia_framework' ) . ' - '. $resp_sizes_desc[ $size ],
								'desc'		=> __( 'Set a custom padding. Both pixel and &percnt; based values are accepted. eg: 30px, 5&percnt;. Leave empty for default or inherit desktop setting.', 'avia_framework' ),
								'id'		=> $resp_size_key . 'tab_padding_custom',
								'type'		=> 'multi_input',
//								'sync'		=> true,
								'std'		=> '',
								'required'	=> array( $resp_size_key . 'tab_padding', 'equals', 'custom' ),
								'multi'		=> array(
												'top'		=> __( 'Padding Top ', 'avia_framework' )
											)
								);

				$template[] = array(
								'name'		=> __( 'Slides Content Padding', 'avia_framework' ) . ' - '. $resp_sizes_desc[ $size ],
								'desc'		=> __( 'Define the slide sections top and bottom padding', 'avia_framework' ),
								'id'		=> $resp_size_key . 'padding',
								'type'		=> 'select',
								'std'		=> '',
								'subtype'	=> array(
													__( 'Default Padding (50px 50px)', 'avia_framework' )	=> '',
													__( 'No Padding', 'avia_framework' )					=> 'no-padding',
													__( 'Small Padding (20px 20px)', 'avia_framework' )		=> 'small',
													__( 'Large Padding (70px 70px)', 'avia_framework' )		=> 'large',
													__( 'Huge Padding (130px 130px)', 'avia_framework' )	=> 'huge',
													__( 'Custom Padding', 'avia_framework' )				=> 'custom'
												)
							);

				$template[] = array(
								'name'		=> __( 'Custom Slides Content Padding', 'avia_framework' ) . ' - '. $resp_sizes_desc[ $size ],
								'desc'		=> __( 'Set a custom padding. Both pixel and &percnt; based values are accepted. eg: 30px, 5&percnt;. Leave empty for default or inherit desktop setting.', 'avia_framework' ),
								'id'		=> $resp_size_key . 'padding_custom',
								'type'		=> 'multi_input',
								'sync'		=> true,
								'std'		=> '',
								'required'	=> array( $resp_size_key . 'padding', 'equals', 'custom' ),
								'multi'		=> array(
												'top'		=> __( 'Padding Top ', 'avia_framework' ),
												'right'		=> __( 'Padding Right', 'avia_framework' ),
												'bottom'	=> __( 'Padding Bottom', 'avia_framework' ),
												'left'		=> __( 'Padding Left', 'avia_framework' )
											)
								);

				$template[] = array(
								'type' 	=> 'icon_switcher_close',
								'nodescription' => true
						);

			}

			$template[] = array(
								'type' 	=> 'icon_switcher_container_close',
								'nodescription' => true
							);

			$return = array(
							array(
								'type'			=> 'template',
								'template_id'	=> 'toggle',
								'title'			=> __( 'Margin And Padding', 'avia_framework' ),
								'content'		=> $template
							),
					);

			return $return;
		}
	}

}
