uni.$u.setConfig({
	// 修改$u.config对象的属性
	config: {
		// 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
		unit: 'rpx'
	},
	// 修改$u.props对象的属性
	props: {
		search: {
			searchIcon: '/static/images/search.png',
			searchIconSize: 30,
			height: 80,
			searchIconColor: '#bbbbbb',
			placeholderColor: '#bbbbbb',
			shape: 'square',
			margin: '0 0 0 30rpx',
			actionStyle: () => {
				return {
					color: '#ffffff', 
					fontSize: '32rpx'
				}
			}
		},
		loadingIcon: {
			size: '48rpx',
			textSize: '30rpx'
		},
		input: {
			fontSize: 32
		},
		line: {
			hairline: false,
			color: '#ededed'
		},
		picker: {
			itemHeight: 96,
			cancelColor: '#969799',
			confirmColor: '#11479b',
			closeOnClickOverlay: true
		},
		upload: {
			uploadIcon: '/static/images/image-add-line.png',
			width: 154,
			height: 154
		},
		datetimePicker: {
			itemHeight: 96,
			cancelColor: '#969799',
			confirmColor: '#11479b',
			closeOnClickOverlay: true
		},
		textarea: {
			border: 'none',
			maxlength: 200
		},
		loadmore: {
			fontSize: 28
		},
		toolbar: {
			cancelColor: '#969799',
			confirmColor: '#11479b'
		},
		empty: {
			textSize: 28,
			iconSize: 180,
			width: 320,
			height: 320
		},
		tabs: {
			lineColor: '#11479b',
			lineWidth: '84rpx',
			lineHeight: '8rpx',
			itemStyle: () => {
				return {
					height: '90rpx'
				}
			},
			activeStyle: () => {
				return {
					fontSize: '34rpx',
					color: '#11479b'
				}
			},
			inactiveStyle: () => {
				return {
					fontSize: '34rpx',
					color: '#646566'
				}
			}
		},
		skeleton: {
			rowsHeight: 36,
			titleHeight: 36,
			avatarSize: 64
		},
		calendar: {
			rowHeight: 112,
			color: '#11479b'
		},
		button: {
			type: 'primary',
			loadingSize: 30,
			throttleTime: 350
		},
		popup: {
			round: 8
		}
	}
})