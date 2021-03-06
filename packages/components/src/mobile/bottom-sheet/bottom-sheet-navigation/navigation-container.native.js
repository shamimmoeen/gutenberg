/**
 * External dependencies
 */
import { View, Easing } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

/**
 * WordPress dependencies
 */
import {
	useState,
	useContext,
	useMemo,
	Children,
	useRef,
} from '@wordpress/element';

import { usePreferredColorSchemeStyle } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { performLayoutAnimation } from '../../layout-animation';
import {
	BottomSheetNavigationContext,
	BottomSheetNavigationProvider,
} from './bottom-sheet-navigation-context';

import styles from './styles.scss';

const AnimationSpec = {
	animation: 'timing',
	config: {
		duration: 200,
		easing: Easing.ease,
	},
};

const fadeConfig = ( { current } ) => {
	return {
		cardStyle: {
			opacity: current.progress,
		},
	};
};

const options = {
	transitionSpec: {
		open: AnimationSpec,
		close: AnimationSpec,
	},
	headerShown: false,
	gestureEnabled: false,
	cardStyleInterpolator: fadeConfig,
};

const ANIMATION_DURATION = 190;

function BottomSheetNavigationContainer( { children, animate, main, theme } ) {
	const Stack = useRef( createStackNavigator() ).current;
	const context = useContext( BottomSheetNavigationContext );
	const [ currentHeight, setCurrentHeight ] = useState(
		context.currentHeight || 1
	);

	const backgroundStyle = usePreferredColorSchemeStyle(
		styles.background,
		styles.backgroundDark
	);

	const _theme = theme || {
		...DefaultTheme,
		colors: {
			...DefaultTheme.colors,
			background: backgroundStyle.backgroundColor,
		},
	};

	const setHeight = ( height, layout ) => {
		if ( currentHeight !== height && height > 1 ) {
			if ( animate && layout && currentHeight === 1 ) {
				setCurrentHeight( height );
			} else if ( animate ) {
				performLayoutAnimation( ANIMATION_DURATION );
				setCurrentHeight( height );
			} else {
				setCurrentHeight( height );
			}
		}
	};

	const screens = useMemo( () => {
		return Children.map( children, ( child ) => {
			const { name, ...otherProps } = child.props;
			return (
				<Stack.Screen
					name={ name }
					{ ...otherProps }
					children={ () => child }
				/>
			);
		} );
	}, [ children ] );

	return useMemo( () => {
		return (
			<View style={ { height: currentHeight } }>
				<BottomSheetNavigationProvider
					value={ { setHeight, currentHeight } }
				>
					{ main ? (
						<NavigationContainer theme={ _theme }>
							<Stack.Navigator screenOptions={ options }>
								{ screens }
							</Stack.Navigator>
						</NavigationContainer>
					) : (
						<Stack.Navigator screenOptions={ options }>
							{ screens }
						</Stack.Navigator>
					) }
				</BottomSheetNavigationProvider>
			</View>
		);
	}, [ currentHeight, _theme ] );
}

export default BottomSheetNavigationContainer;
