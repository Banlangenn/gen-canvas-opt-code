import React, { useEffect, useState } from 'react';
import { Button, Modal, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { format } from 'prettier';
import parser from 'prettier/parser-babel';
import Editor from 'react-simple-code-editor';
import { CopyToClipboard } from 'react-copy-to-clipboard';
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
		fontFamily: 'Menlo, Monaco, "Courier New", monospace',
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

	const handleCopyed = () => {
		message.success('复制成功');
	};
	return (
		<Modal
			title="导出代码"
			width={800}
			open={open}
			onCancel={() => setOpen(false)}
			centered
			footer={null}
		>
			<div className="relative">
				<CopyToClipboard onCopy={handleCopyed} text={code}>
					<Button
						type="dashed"
						size="small"
						ghost
						className="absolute top-[10px] right-[10px] z-50"
					>
						<CopyOutlined />
						复制代码
					</Button>
				</CopyToClipboard>

				<Editor
					value={code}
					onValueChange={setCode}
					highlight={highlight}
					padding={10}
					style={styles.root as React.CSSProperties}
				/>
			</div>
		</Modal>
	);
};

export default ExportCodeModal;
