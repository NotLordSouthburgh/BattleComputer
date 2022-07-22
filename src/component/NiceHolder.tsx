type NiceHolderProps = {
  children: React.ReactNode;
};

export function NiceHolder({ children }: NiceHolderProps) {
  return <div className="p-4 m-4 bg-tileboard rounded-md">{children}</div>;
}
