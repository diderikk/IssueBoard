module Types
	class IssueBoardType < GraphQL::Schema::Object
		field :id, ID, null: false
		field :name, String, null: false
		field :users, [Types::UserType], null: true
		field :group, Types::GroupType, null: true
		field :issue_labels, [Types::IssueLabelType], null: false

		def self.authorized?(object, context)
			if User.joins(groups: :issue_boards).where(issue_boards: { id: object.id }, members: { accepted: true }).exists?(context[:current_user].id)
				super
			elsif User.joins(:issue_boards).where(issue_boards: { id: object.id }).exists?(context[:current_user].id)
				super
			end
			# if object.group
			# 	super && Types::GroupType.authorized?(object.group, context)
			# else
			# 	super && Types::UserType.authorized?(object.user,context)
			# end
		end
	end
end