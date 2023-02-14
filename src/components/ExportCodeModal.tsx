import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { format } from 'prettier';
import parser from 'prettier/parser-babel';
import Editor from 'react-simple-code-editor';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/nightOwl';
import { useCanvasStore } from '../store';

interface PropsType {
	open: boolean;
	setOpen: (open: boolean) => void;
}

const styles = {
	root: {
		boxSizing: 'border-box',
		fontFamily: '"Dank Mono", "Fira Code", monospace',
		...theme.plain,
	},
};

const parserConfig = {
	parser: 'json',
	plugins: [parser],
};

/** 导出代码弹窗 */
const ExportCodeModal = ({ open, setOpen }: PropsType) => {
	const elList = useCanvasStore((state) => state.elList);
	const [code, setCode] = useState('');

	useEffect(() => {
		const elListJsonStr = JSON.stringify(
			elList.map((el) => {
				const expKeys = Object.keys(el).filter((k) => k !== 'internal');
				const expObj: any = {};
				expKeys.forEach((key) => {
					// @ts-ignore
					expObj[key] = el[key];
				});
				return expObj;
			}),
		);
		setCode(format(elListJsonStr, parserConfig));
	}, [elList]);

	const highlight = (code: string) => (
		<Highlight {...defaultProps} theme={theme} code={code} language="jsx">
			{({ className, style, tokens, getLineProps, getTokenProps }) => (
				<>
					{tokens.map((line, i) => (
						<div {...getLineProps({ line, key: i })}>
							{line.map((token, key) => (
								<span {...getTokenProps({ token, key })} />
							))}
						</div>
					))}
				</>
			)}
		</Highlight>
	);
	return (
		<Modal
			title="导出代码"
			open={open}
			onCancel={() => setOpen(false)}
			centered
			footer={null}
		>
			<Editor
				value={code}
				onValueChange={setCode}
				highlight={highlight}
				padding={10}
				style={styles.root as React.CSSProperties}
			/>
		</Modal>
	);
};

export default ExportCodeModal;
