import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Image from 'next/image';

interface AvatarProps {
  src?: string | null | undefined;
  height?: number | undefined;
  width?: number | undefined;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  height = 30,
  width = 30,
}) => {
  if (src) {
    return (
      <Image
        src={src}
        alt="Avatar"
        className="rounded-full"
        height={height}
        width={width}
      />
    );
  }
  return (
    <FaUserCircle
      style={{ height: `${height}`, width: `${width}` }}
    />
  );
};

export default Avatar;
