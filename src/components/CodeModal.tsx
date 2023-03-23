import React, { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { Alert, Button, Modal, message } from 'antd';
import { CheckCircleOutlined, CopyOutlined } from '@ant-design/icons';
import { format } from 'prettier';
import parser from 'prettier/parser-babel';
import Editor from 'react-simple-code-editor';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/nightOwl';
import { useCanvasStore } from '../store';
import { CodeModalType } from '../types';
import { verifyImportCode } from '../utils';

interface PropsType {
	/** 弹窗类型 导入 导出 */
	type: CodeModalType;
	/** 弹窗开关 */
	open: boolean;
	/** 设置弹窗开关 */
	setOpen: (open: boolean) => void;
}

const styles = {
	root: {
		boxSizing: 'border-box',
		fontFamily: 'Menlo, Monaco, "Courier New", monospace',
		borderRadius: 10,
		...theme.plain,
	},
};

const parserConfig = {
	parser: 'json',
	plugins: [parser],
};

/** 导入导出代码弹窗 */
const CodeModal = ({ type = 'export', open, setOpen }: PropsType) => {
	const { elList, updateElList } = useCanvasStore((state) => ({
		updateElList: state.updateElList,
		elList: state.elList,
	}));
	const [code, setCode] = useState('');

	useEffect(() => {
		if (!open) return;
		if (type === 'export') {
			const elListJsonStr = JSON.stringify(
				elList.map((el) => {
					const expKeys = Object.keys(el).filter(
						(k) =>
							!(el.type === 'text' && /width|height/.test(k)) &&
							k !== 'internal',
					);
					const expObj: any = {};
					expKeys.forEach((key) => {
						// @ts-ignore
						expObj[key] = el[key];
					});
					return expObj;
				}),
			);
			setCode(format(elListJsonStr, parserConfig));
		} else {
			setCode('[]');
		}
	}, [open]);

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

	// 确认导入
	const handleImport = () => {
		try {
			const list = JSON.parse(code);
			if (verifyImportCode(list)) {
				list.forEach((item: any, index: number) => {
					item.internal = {
						id: nanoid(),
						index,
					};
				});
				message.success('导入成功');
				updateElList(list);
				setOpen(false);
			}
		} catch (error) {
			Modal.error({
				title: '导入失败！',
				content: String(error),
				okText: '确定',
			});
		}
	};

	return (
		<Modal
			title={`${type === 'export' ? '导出' : '导入'}代码`}
			width={800}
			open={open}
			onCancel={() => setOpen(false)}
			centered
			footer={null}
		>
			{type === 'import' && (
				<Alert
					message="导入代码只支持 json 格式，并且需要将动态参数都转为真实值，才可正确渲染。"
					type="warning"
					className="my-16"
				/>
			)}

			<div className="relative">
				{type === 'import' && (
					<Button
						type="dashed"
						size="small"
						ghost
						icon={<CheckCircleOutlined />}
						className="absolute top-[10px] right-[120px] z-50"
						onClick={handleImport}
					>
						确认导入
					</Button>
				)}

				<CopyToClipboard onCopy={handleCopyed} text={code}>
					<Button
						type="dashed"
						size="small"
						ghost
						icon={<CopyOutlined />}
						className="absolute top-[10px] right-[10px] z-50"
					>
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

export default CodeModal;
