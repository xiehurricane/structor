/*
 * Copyright 2015 Alexander Pustovalov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';

const PageTreeViewPlaceholder = (props) => {
	let style = {marginLeft: '-1.75em'};
	if(props.isTopLevelPlace){
		style.marginLeft = '-.45em';
	}
	return (
		<li	className="treeview-placeholder-base" style={style}>
			<div className="treeview-placeholder">
				<div className="treeview-placeholder-line" />
				<div className="treeview-placeholder-circle" onClick={e => props.onClick(props.itemKey)} />
			</div>
		</li>
	);
};

export default PageTreeViewPlaceholder;