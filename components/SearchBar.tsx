"use client";

import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

type Props = {
	value: string;
	onChange: (v: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
	return (
		<Input
			autoFocus
			prefix={<SearchOutlined className="text-gray-400" />}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder="Search albums or artists..."
			size="large"
			allowClear
		/>
	);
}
