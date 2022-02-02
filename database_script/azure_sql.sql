IF NOT EXISTS (SELECT * FROM dbo.sysobjects where id = object_id(N'[Todo_list]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
	CREATE TABLE [dbo].[Todo_list](
		[id] [int] IDENTITY(1,1) NOT NULL,
		[text] [nvarchar](max) NOT NULL,
		[status] [tinyint] NOT NULL
	) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO