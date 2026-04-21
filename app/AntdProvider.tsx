"use client";

import { StyleProvider, createCache } from "@ant-design/cssinjs";
import { App, ConfigProvider } from "antd";
import { useMemo } from "react";

export default function AntdProvider({ children }: { children: React.ReactNode }) {
	const cache = useMemo(() => createCache(), []);
	return (
		<StyleProvider cache={cache} hashPriority="high">
			<ConfigProvider
				theme={{
					token: {
						colorPrimary: "#f43f5e",
						borderRadius: 8,
					},
				}}
			>
				<App>{children}</App>
			</ConfigProvider>
		</StyleProvider>
	);
}
