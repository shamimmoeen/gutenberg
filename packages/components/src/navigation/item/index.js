/**
 * External dependencies
 */
import classnames from 'classnames';
import { noop } from 'lodash';

/**
 * WordPress dependencies
 */
import { Icon, chevronRight } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import Button from '../../button';
import { useNavigationContext } from '../context';
import { ItemBadgeUI, ItemTitleUI, ItemUI } from '../styles/navigation-styles';
import { useNavigationTreeItem } from './use-navigation-tree-item';
import { useNavigationMenuContext } from '../menu/context';

export default function NavigationItem( props ) {
	useNavigationTreeItem( props );

	const {
		badge,
		children,
		className,
		href,
		item,
		navigateToMenu,
		onClick = noop,
		title,
		...restProps
	} = props;
	const { activeItem, setActiveItem, setActiveMenu } = useNavigationContext();
	const { isActive } = useNavigationMenuContext();

	if ( ! isActive ) {
		return null;
	}

	const classes = classnames( 'components-navigation__item', className, {
		'is-active': item && activeItem === item,
	} );

	const onItemClick = () => {
		if ( navigateToMenu ) {
			setActiveMenu( navigateToMenu );
		} else if ( ! href ) {
			setActiveItem( item );
		}
		onClick();
	};

	return (
		<ItemUI className={ classes }>
			<Button href={ href } onClick={ onItemClick } { ...restProps }>
				{ title && (
					<ItemTitleUI
						className="components-navigation__item-title"
						variant="body.small"
						as="span"
					>
						{ title }
					</ItemTitleUI>
				) }

				{ children }

				{ badge && (
					<ItemBadgeUI className="components-navigation__item-badge">
						{ badge }
					</ItemBadgeUI>
				) }

				{ navigateToMenu && <Icon icon={ chevronRight } /> }
			</Button>
		</ItemUI>
	);
}
