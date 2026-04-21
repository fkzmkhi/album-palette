# Ant Design UI Skill

Apply Ant Design design principles to this Next.js project.

## Usage

```
/ant-design [component or feature to style]
```

## Steps

1. **Install dependencies** (if not already present):
   ```bash
   npm install antd @ant-design/icons
   ```

2. **Read the target file(s)** to understand the current structure.

3. **Apply Ant Design components** following the guidelines below.

4. **Verify** the result renders correctly with `npm run dev`.

---

## Design Guidelines

### Layout
- Use `<Layout>`, `<Header>`, `<Content>`, `<Footer>` for page structure
- Use `<Space>` for inline spacing instead of manual margins
- Use `<Divider>` between sections

### Typography
- `<Typography.Title level={1–5}>` for headings
- `<Typography.Text type="secondary">` for muted text
- `<Typography.Paragraph>` for body text

### Colors & Theme
Use the Ant Design token system. In `app/layout.tsx`, wrap with `<ConfigProvider>`:
```tsx
import { ConfigProvider } from 'antd';

<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#1677ff',
      borderRadius: 8,
    },
  }}
>
  {children}
</ConfigProvider>
```

### Components → Ant Design equivalents

| Current                  | Ant Design                             |
|--------------------------|----------------------------------------|
| `<input>`                | `<Input>` / `<Input.Search>`           |
| `<button>`               | `<Button type="primary">`             |
| `<img>` card grid        | `<Card cover={<img>}>` in `<List>`    |
| loading spinner          | `<Spin>` or `<Skeleton>`              |
| error message            | `<Alert type="error">`                |
| clipboard copy           | `<Typography.Text copyable>`          |
| color swatch             | Custom — wrap in `<Tooltip>` + `<Tag>`|
| modal / detail panel     | `<Modal>` or `<Drawer>`               |
| favorites icon           | `<Button icon={<HeartOutlined />}>`   |
| history list             | `<List>` with `<List.Item.Meta>`      |

### Form & Search
```tsx
import { Input } from 'antd';
<Input.Search
  placeholder="Search albums..."
  onSearch={handleSearch}
  loading={isLoading}
  allowClear
/>
```

### Grid / Album Cards
```tsx
import { List, Card } from 'antd';
<List
  grid={{ gutter: 16, xs: 2, sm: 3, md: 4, lg: 5 }}
  dataSource={albums}
  renderItem={(album) => (
    <List.Item>
      <Card hoverable cover={<img src={album.imageUrl} />}>
        <Card.Meta title={album.name} description={album.artist} />
      </Card>
    </List.Item>
  )}
/>
```

### Color Palette display
```tsx
import { Tooltip, Tag } from 'antd';
{palette.map((color) => (
  <Tooltip key={color.hex} title={color.hex}>
    <Tag
      color={color.hex}
      style={{ width: 32, height: 32, cursor: 'pointer' }}
      onClick={() => navigator.clipboard.writeText(color.hex)}
    />
  </Tooltip>
))}
```

### Dark mode
Pass `algorithm: theme.darkAlgorithm` in `<ConfigProvider>` when the OS prefers dark:
```tsx
import { theme } from 'antd';
const { useToken } = theme;
// or detect with: window.matchMedia('(prefers-color-scheme: dark)')
```

---

## Do / Don't

- **Do** use Ant Design tokens (`colorPrimary`, `borderRadius`) instead of hardcoded hex values
- **Do** keep Tailwind utility classes for layout spacing; they coexist fine with Ant Design
- **Don't** mix Ant Design `<Button>` with raw `<button>` in the same component
- **Don't** override Ant Design component styles via inline `style` unless unavoidable — prefer `theme.token` or CSS modules

## Next.js / SSR note

Ant Design v5 supports SSR. Add this to `app/layout.tsx` for correct hydration:
```tsx
import { StyleProvider } from '@ant-design/cssinjs';
<StyleProvider hashPriority="high">
  <ConfigProvider ...>
    {children}
  </ConfigProvider>
</StyleProvider>
```
