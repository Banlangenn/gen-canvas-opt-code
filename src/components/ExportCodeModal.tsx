import React, { useState } from 'react';
import { Modal } from 'antd';
import Editor from 'react-simple-code-editor';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/nightOwl';

interface PropsType {
	open: boolean;
	setOpen: (open: boolean) => void;
}

const exampleCode = `
(function someDemo() {
  var test = "Hello World!";
  console.log(test);
})();

return () => <App />;
`;

const styles = {
	root: {
		boxSizing: 'border-box',
		fontFamily: '"Dank Mono", "Fira Code", monospace',
		...theme.plain,
	},
};

const ExportCodeModal = ({ open, setOpen }: PropsType) => {
	const [code, setCode] = useState(exampleCode);

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
